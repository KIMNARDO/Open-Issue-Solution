package com.papsnet.openissue.common.controller;

import com.papsnet.openissue.common.dto.*;
import com.papsnet.openissue.common.exception.CInvalidArgumentException;
import com.papsnet.openissue.common.exception.CInvalidPasswordException;
import com.papsnet.openissue.common.exception.CRequiredException;
import com.papsnet.openissue.common.exception.CUnknownException;
import com.papsnet.openissue.common.service.DObjectService;
import com.papsnet.openissue.common.service.HttpFileService;
import com.papsnet.openissue.common.service.ResponseService;
import com.papsnet.openissue.util.SemsValut;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;

@Slf4j
@Tag(name = "Http 파일 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/http-file")
public class HttpFileController {
    private final ResponseService responseService;
    private final HttpFileService httpFileService;
    private final DObjectService dObjectService;
    private final SemsValut semsValut;

    @Operation(summary = "파일 업로드 및 메타데이터 저장", description = "type, oid(row/tempPartNo 선택) 기준으로 파일 업로드 및 T_DFILE 저장")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResult upload(
            @Parameter(description = "객체 타입", required = false) @RequestParam(required = false) String type,
            @Parameter(description = "객체 OID", required = true) @RequestParam Integer oid,
            @Parameter(description = "행 번호", required = false) @RequestParam(required = false) Integer row,
            @Parameter(description = "임시 품번", required = false) @RequestParam(required = false) String tempPartNo,
            @Parameter(description = "첨부파일 목록", required = false) @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            DObject data = new DObject();

            if(oid == null || oid <= 0)
            {
                return responseService.getFailResult(CInvalidArgumentException.getCode(), CInvalidArgumentException.getCustomMessage());
            }

            if(type == null || type.isEmpty())
            {
                DObject cond = new DObject();
                cond.setOid(oid);
                data = dObjectService.selDObject(cond, reqUserUid);
                type = (data == null) ? type : data.getType();
            }

            if(type == null || type.isEmpty())
            {
                return responseService.getFailResult(CInvalidArgumentException.getCode(), CInvalidArgumentException.getCustomMessage());
            }
            httpFileService.insertData(reqUserUid, oid, type, files, row, tempPartNo);
            return responseService.getSuccessResult();
        } catch (CRequiredException e) {
            return responseService.getFailResult(CRequiredException.getCode(), CRequiredException.getCustomMessage());
        } catch (CInvalidArgumentException e) {
            return responseService.getFailResult(CInvalidArgumentException.getCode(), CInvalidArgumentException.getCustomMessage());
        } catch (CInvalidPasswordException e) {
            return responseService.getFailResult(CInvalidPasswordException.getCode(), CInvalidPasswordException.getCustomMessage());
        } catch (Exception e) {
            return responseService.getFailResult(CUnknownException.getCode(), CUnknownException.getCustomMessage());
        }
    }

    @Operation(summary = "BOM 파일 업로드 및 저장", description = "BOM 컨텍스트에서 파일 업로드 및 T_DFILE 저장")
    @PostMapping(value = "/bom/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResult uploadBom(
            @Parameter(description = "객체 타입", required = false) @RequestParam(required = false) String type,
            @Parameter(description = "객체 OID", required = true) @RequestParam Integer oid,
            @Parameter(description = "행 번호", required = false) @RequestParam(required = false) Integer row,
            @Parameter(description = "임시 품번", required = false) @RequestParam(required = false) String tempPartNo,
            @Parameter(description = "첨부파일 목록", required = false) @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            DObject data = new DObject();

            if(oid == null || oid <= 0)
            {
                return responseService.getFailResult(CInvalidArgumentException.getCode(), CInvalidArgumentException.getCustomMessage());
            }

            if(type == null || type.isEmpty())
            {
                DObject cond = new DObject();
                cond.setOid(oid);
                data = dObjectService.selDObject(cond, reqUserUid);
                type = (data == null) ? type : data.getType();
            }

            if(type == null || type.isEmpty())
            {
                return responseService.getFailResult(CInvalidArgumentException.getCode(), CInvalidArgumentException.getCustomMessage());
            }

            httpFileService.insertBomFileData(reqUserUid, oid, type, files, row, tempPartNo);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            return responseService.getFailResult();
        }
    }

    @Operation(summary = "파일 단건 조회", description = "fileOid 또는 기타 조건으로 파일 1건 조회")
    @GetMapping("/{fileOid}")
    public DataResult<HttpFile> getFile(
            @PathVariable Integer fileOid
    ) {
        try {
            HttpFile cond = new HttpFile();
            cond.setFileOid(fileOid);
            return new ResponseService().getDataResult(httpFileService.selFile(cond));
        } catch (Exception e) {
            return new ResponseService().getDataResult(-1, "조회 실패", null);
        }
    }

    @Operation(summary = "파일 목록 조회", description = "type/oid/row/tempPartNo 조건으로 파일 목록 조회")
    @GetMapping("/list")
    public ListResult<HttpFile> listFiles(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer oid,
            @RequestParam(required = false) Integer row,
            @RequestParam(required = false) String tempPartNo
    ) {
        try {
            HttpFile cond = new HttpFile();
            cond.setType(type);
            cond.setOid(oid);
            cond.setRow(row);
            cond.setTempPartNo(tempPartNo);
            return responseService.getListResult(httpFileService.selFiles(cond));
        } catch (Exception e) {
            return responseService.getListResult(java.util.Collections.emptyList());
        }
    }

    @Operation(summary = "파일 삭제", description = "fileOid 기준 파일 삭제")
    @DeleteMapping("/{fileOid}")
    public CommonResult delete(
            @PathVariable Integer fileOid,
            @Parameter(hidden = true) @RequestParam int reqUserUid) {
        try {
            HttpFile cond = new HttpFile();
            cond.setFileOid(fileOid);
            httpFileService.deleteData(reqUserUid, cond);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            return responseService.getFailResult();
        }
    }

    @Operation(summary = "BOM 파일 삭제", description = "조건 조회 후 삭제")
    @PostMapping("/bom/delete")
    public CommonResult deleteBom(@RequestBody HttpFile cond,
                                  @Parameter(hidden = true) @RequestParam int reqUserUid) {
        try {
            httpFileService.deleteBomFileData(reqUserUid, cond);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            return responseService.getFailResult();
        }
    }

    @Operation(summary = "파일 개정 복제", description = "조건의 파일들을 newOid로 복사/이관")
    @PostMapping("/revise")
    public CommonResult revise(@RequestBody HttpFile cond,
                               @RequestParam Integer newOid,
                               @Parameter(hidden = true) @RequestParam int reqUserUid) {
        try {
            httpFileService.reviseFiles(reqUserUid, cond, newOid);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            return responseService.getFailResult();
        }
    }

    @Operation(summary = "파일 다운로드", description = "fileOid 기준 파일을 다운로드합니다.")
    @GetMapping("/download/{fileOid}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Integer fileOid) {
        try {
            if (fileOid == null || fileOid <= 0) {
                return ResponseEntity.badRequest().build();
            }
            HttpFile cond = new HttpFile();
            cond.setFileOid(fileOid);
            HttpFile file = httpFileService.selFile(cond);
            if (file == null) {
                return ResponseEntity.notFound().build();
            }

            String fullPath = semsValut.getFileString(file);
            if (fullPath == null || fullPath.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            String path = SemsValut.DEFAULT_AUTOVUE_TEMP_ROOT + fullPath;
            path = path.replace("\\", "/");
            path = Paths.get(path).toAbsolutePath().normalize().toString();

            if (!Files.exists(Path.of(path)) || !Files.isRegularFile(Path.of(path))) {
                return ResponseEntity.notFound().build();
            }

            byte[] bytes = Files.readAllBytes(Path.of(path));
            ByteArrayResource resource = new ByteArrayResource(bytes);

            String originalName = Objects.toString(file.getOrgNm(), file.getConvNm());
            if (originalName == null || originalName.isEmpty()) originalName = file.getOrgNm();

            String encodedFileName = URLEncoder.encode(originalName, java.nio.charset.StandardCharsets.UTF_8).replaceAll("\\+", "%20");
            String contentType = Files.probeContentType(Path.of(path));
            if (contentType == null || contentType.isEmpty()) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + originalName + "\"; filename*=UTF-8''" + encodedFileName)
                    .header(HttpHeaders.CONTENT_LENGTH, String.valueOf(bytes.length))
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
