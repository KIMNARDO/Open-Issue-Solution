package com.papsnet.openissue.translation;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.util.ExcelUtil;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.classic.methods.HttpGet;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.entity.mime.HttpMultipartMode;
import org.apache.hc.client5.http.entity.mime.MultipartEntityBuilder;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.HttpEntity;
import org.apache.hc.core5.http.HttpStatus;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.net.URIBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.regex.Pattern;

@Component
@Slf4j
public class NCPTranlsationModule implements MachineTranslationModule {

    @Value("${ncp.client.id}")
    private String clientId;
    @Value("${ncp.client.secret}")
    private String clientSecret;
    @Value("${ncp.glossary.key}")
    private String glossaryKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private static final Pattern KOREAN_PATTERN = Pattern.compile(".*[가-힣]+.*");
    private static final String DOC_API_BASE_URL = "https://papago.apigw.ntruss.com/doc-trans/v1";
    private static final int API_RETRY_COUNT = 15;

    private boolean containsKorean(String text) {
        return KOREAN_PATTERN.matcher(text).matches();
    }

    private NCPTranslationResult extractResult(String rawData) {
        try {
            JsonNode root = objectMapper.readTree(rawData);
            return objectMapper.convertValue(root.path("message").path("result"), NCPTranslationResult.class);
        } catch (Exception e) {
            // 필요시 로깅 또는 예외 던지기
            log.error(e.getMessage());
            return null;
        }
    }

    public NCPTranslationProgress getTranslationStatus(String requestId) {
        String apiURL = DOC_API_BASE_URL + "/status";

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {

            // URI 생성 및 query parameter 추가
            URI uri = new URIBuilder(apiURL)
                    .addParameter("requestId", requestId)
                    .build();

            // GET 요청 객체 생성
            HttpGet request = new HttpGet(uri);
            request.addHeader("X-NCP-APIGW-API-KEY-ID", clientId);
            request.addHeader("X-NCP-APIGW-API-KEY", clientSecret);

            String result =
                    httpClient.execute(request, classicHttpResponse -> EntityUtils.toString(classicHttpResponse.getEntity()));
            try {
                JsonNode root = objectMapper.readTree(result);
                return objectMapper.convertValue(root.path("data"), NCPTranslationProgress.class);
            } catch (Exception e) {
                // 필요시 로깅 또는 예외 던지기
                log.error(e.getMessage());
                return null;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return null;
    }

    private byte[] downloadTranslationResult(String requestId) {
        String apiURL = DOC_API_BASE_URL + "/download";

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {

            // URI 생성 및 query parameter 추가
            URI uri = new URIBuilder(apiURL)
                    .addParameter("requestId", requestId)
                    .build();

            // GET 요청 객체 생성
            HttpGet request = new HttpGet(uri);
            request.addHeader("X-NCP-APIGW-API-KEY-ID", clientId);
            request.addHeader("X-NCP-APIGW-API-KEY", clientSecret);

            return httpClient.execute(request, classicHttpResponse -> {
                if (classicHttpResponse.getCode() == HttpStatus.SC_OK) {
                    HttpEntity entity = classicHttpResponse.getEntity();
                    if (entity != null) {
                        try (InputStream inputStream = entity.getContent()) {
                            return inputStream.readAllBytes();
                        } finally {
                            EntityUtils.consume(entity); // Ensure entity content is fully consumed or released
                        }
                    }
                } else {
                    System.err.println("다운로드 실패. HTTP Status Code: " + classicHttpResponse.getCode());
                    return null;
                }
                return null;
            });

        } catch (Exception e) {
            log.error(e.getMessage());
            return null;
        }
    }

    /**
     * 주어진 객체 내 String 필드 중 한글 포함된 값을 번역하고 객체에 다시 세팅함.
     *
     * @param target 번역 대상 객체
     */
    @Override
    public <T> List<T> translateObjects(@NonNull List<T> target) {
        try {
            String apiURL = DOC_API_BASE_URL + "/translate";
            Map<String, String> baseParams = new HashMap<>();
            baseParams.put("source", "ko");
            baseParams.put("target", "en");
            baseParams.put("glossaryKey", glossaryKey);
            Map<String, byte[]> fileParams = new HashMap<>();
            byte[] dataExcel = ExcelUtil.exportToExcel(target);
            try(FileOutputStream fos = new FileOutputStream("input.xlsx")) {
                fos.write(dataExcel);
                fos.flush();
            }
            if(dataExcel.length < 1) throw new CBizProcessFailException("생성된 데이터 테이블이 없습니다");
            fileParams.put("file", dataExcel);

            String result = sendMultipartRequest(apiURL, baseParams, fileParams);

            String reqId = null;
            try {
                JsonNode root = objectMapper.readTree(result);
                reqId = root.path("data").get("requestId").asText();
            } catch (Exception e) {
                log.error(e.getMessage());
                throw new CBizProcessFailException("번역 오류");
            }

            if (reqId == null) throw new CBizProcessFailException("번역 오류");
            log.info("요청된 번역 : {}", reqId);

            int retryCount = 0;
            while (retryCount < API_RETRY_COUNT) {
                int RETRY_INTERVAL = 1000;
                try {
                    NCPTranslationProgress progress = getTranslationStatus(reqId);
                    // null check
                    if (progress == null || progress.getStatus() == null) {
                        log.info("Progress 상태를 가져오지 못했습니다. 재시도합니다...");
                    } else if (progress.getStatus().equals(NCPTranslationConst.NCPProgressStatus.PROGRESS.name())) {
                        log.info("번역 중 {}%", progress.getProgressPercent());
                    } else if (progress.getStatus().equals(NCPTranslationConst.NCPProgressStatus.COMPLETE.name())) {
                        log.info("번역이 완료되었습니다.");
                        break; // 완료 시 루프 종료
                    } else if (progress.getStatus().equals(NCPTranslationConst.NCPProgressStatus.FAILED.name())) {
                        log.error("번역이 실패했습니다.");
                        log.error(progress.getErrMsg());
                        break; // 실패 시 루프 종료
                    }

                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL); // 0.5초 대기

                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new RuntimeException("Progress 체크가 인터럽트되었습니다.", e);
                } catch (Exception e) {
                    log.error("번역 상태 확인 중 오류 발생: {}", e.getMessage());
                    retryCount++;
                    Thread.sleep(RETRY_INTERVAL);
                }
            }
            // 최대 횟수 초과 시
            if (retryCount >= API_RETRY_COUNT) {
                log.error("최대 재시도 횟수를 초과했습니다. 번역이 완료되지 않았을 수 있습니다.");
            }

            byte[] downloaded = downloadTranslationResult(reqId);
            if (downloaded == null) throw new CBizProcessFailException("파일 다운로드 오류");
            try(FileOutputStream fos = new FileOutputStream("result.xlsx")) {
                fos.write(downloaded);
                fos.flush();
            }

            return ExcelUtil.importFromExcel(downloaded, target);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return new ArrayList<>();
    }

    private String sendMultipartRequest(String apiUrl,
                                        Map<String, String> textFields,
                                        Map<String, byte[]> fileFields) throws IOException {

        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(apiUrl);

            // header
            post.addHeader("X-NCP-APIGW-API-KEY-ID", clientId);
            post.addHeader("X-NCP-APIGW-API-KEY", clientSecret);

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.setMode(HttpMultipartMode.EXTENDED);
            builder.setCharset(StandardCharsets.UTF_8);

            // 텍스트 필드 추가
            if (textFields != null) {
                for (Map.Entry<String, String> entry : textFields.entrySet()) {
                    builder.addTextBody(entry.getKey(), entry.getValue(),
                            ContentType.create("text/plain", StandardCharsets.UTF_8));
                }
            }

            ContentType fileContentType = ContentType.parse("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

            // 파일 필드 추가
            if (fileFields != null) {
                for (Map.Entry<String, byte[]> entry : fileFields.entrySet()) {
                    byte[] content = entry.getValue();
                    if (content.length > 0) {
                        builder.addBinaryBody(entry.getKey(), content,
                                fileContentType, "translation.xlsx");
                    }
                }
            }

            HttpEntity multipart = builder.build();
            post.setEntity(multipart);

            return client.execute(post, classicHttpResponse -> EntityUtils.toString(classicHttpResponse.getEntity()));
        }
    }

    @Override
    public String translate(String target) {

        try {
            String text = URLEncoder.encode(target, StandardCharsets.UTF_8);
            String apiURL = "https://papago.apigw.ntruss.com/nmt/v1/translation";
            URL url = new URL(apiURL);
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("POST");
            con.setRequestProperty("X-NCP-APIGW-API-KEY-ID", clientId);
            con.setRequestProperty("X-NCP-APIGW-API-KEY", clientSecret);
            // post request
            String postParams = "source=ko&target=en&text=" + text + "&glossaryKey=" + glossaryKey;
            con.setDoOutput(true);
            DataOutputStream wr = new DataOutputStream(con.getOutputStream());
            wr.writeBytes(postParams);
            wr.flush();
            wr.close();
            int responseCode = con.getResponseCode();
            BufferedReader br;
            if (responseCode == 200) { // 정상 호출
                br = new BufferedReader(new InputStreamReader(con.getInputStream()));
            } else {  // 오류 발생
                br = new BufferedReader(new InputStreamReader(con.getErrorStream()));
            }
            String inputLine;
            StringBuilder response = new StringBuilder();
            while ((inputLine = br.readLine()) != null) {
                response.append(inputLine);
            }
            br.close();
            return Objects.requireNonNull(extractResult(response.toString())).getTranslatedText();
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return "";
    }

    @Override
    public boolean validate(String json) {
        return false;
    }
}
