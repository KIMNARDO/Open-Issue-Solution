package com.papsnet.openissue.util;

import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.dto.HttpFile;
import com.papsnet.openissue.common.dto.FileLocalStorageConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * Java Spring implementation of legacy C# SemsValut utility.
 * This class handles saving, revising, deleting, and reading files
 * under a configurable vault structure.
 *
 * Note:
 * - Original C# used AES encrypt/decrypt for file names and contents.
 * - This Java port stores files as-is (no encryption) to align with the current
 *   project services (FileLocalStorageService). If encryption is required later,
 *   integrate it inside the read/write areas marked in comments.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class SemsValut {

    private final FileLocalStorageConfig storageConfig;

    @Autowired(required = false)
    private Environment env;

    // Default sub paths (can be overridden by Spring properties)
    public static final String DEFAULT_STORAGE_PATH = "PlmFileStorage";
    public static final String DEFAULT_VALUT_PATH = "FileValut";
    public static final String DEFAULT_TEMP_PATH = "FileTemp";
    public static final String DEFAULT_AUTOVUE_TEMP_ROOT = "D:\\apache-tomcat-8.5.42\\webapps\\Autovue\\PlmFileStorage";

    private String getRootStorage() {
        // Base root folder for all uploads (from application properties)
        String root = Paths.get(DEFAULT_STORAGE_PATH).toString();
        return Paths.get(root).toAbsolutePath().normalize().toString();
    }

    private String getValutPath() {
        String p = getProp("plm.valut-path");
        return StringUtils.isBlank(p) ? DEFAULT_VALUT_PATH : p;
    }

    private String getTempPath() {
        String p = getProp("plm.temp-path");
        return StringUtils.isBlank(p) ? DEFAULT_TEMP_PATH : p;
    }

    private String getAutoVueTempRoot() {
        String p = getProp("plm.autovue-temp-root");
        return StringUtils.isBlank(p) ? DEFAULT_AUTOVUE_TEMP_ROOT : p;
    }

    private String getProp(String key) {
        try {
            if (env != null) {
                String v = env.getProperty(key);
                if (!StringUtils.isBlank(v)) return v;
            }
        } catch (Exception ignore) {}
        return null;
    }

    private Path ensureDirectory(Path dir) throws IOException {
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }
        return dir;
    }

    private static String extractFileName(String original) {
        if (original == null) return null;
        // Handle possible full-path coming from some browsers/clients
        original = original.replace("\\", "/");
        int idx = original.lastIndexOf('/');
        return idx >= 0 ? original.substring(idx + 1) : original;
    }

    private static String getExtension(String name) {
        if (name == null) return "";
        int i = name.lastIndexOf('.');
        return i >= 0 ? name.substring(i) : "";
    }

    private static String getBaseName(String name) {
        if (name == null) return "";
        int i = name.lastIndexOf('.');
        return i >= 0 ? name.substring(0, i) : name;
    }

    private static String uniquify(Path dir, String fileName) {
        String ext = getExtension(fileName);
        String base = getBaseName(fileName);
        Path candidate = dir.resolve(fileName);
        int cnt = 1;
        while (Files.exists(candidate)) {
            String next = String.format("%s (%d)%s", base, cnt++, ext);
            candidate = dir.resolve(next);
        }
        return candidate.getFileName().toString();
    }

    private Path buildVaultDir(String type, Integer oid) {
        return Paths.get(getRootStorage(), getValutPath(),
                StringUtils.defaultString(type, "unknown"),
                oid == null ? "temp" : String.valueOf(oid));
    }

    /**
     * Save single file like C# SaveFile
     */
    public HttpFile saveFile(String type, Integer oid, MultipartFile multipartFile) throws Exception {
        if (multipartFile == null || multipartFile.isEmpty()) return null;

        String originalName = extractFileName(multipartFile.getOriginalFilename());
        Path dir = buildVaultDir(type, oid);
        ensureDirectory(dir);

        // Build encrypted storeName like legacy C# (AESEncrypt256Text)
        String ext = getExtension(originalName);
        String base = getBaseName(originalName);
        String storeName = CipherUtil.encrypt(originalName);
        if (storeName != null && storeName.length() > 150) {
            storeName = storeName.substring(0, 110);
        }
        Path target = dir.resolve(storeName);
        // If name already exists, generate a unique one by altering original, re-encrypting
        if (Files.exists(target)) {
            int cnt = 1;
            while (Files.exists(target)) {
                String newFileName = String.format("%s (%d)%s", base, cnt++, ext);
                String enc = CipherUtil.encrypt(newFileName);
                if (enc != null && enc.length() > 150) {
                    // mimic C# logic: truncate and append counter
                    enc = enc.substring(0, 110) + cnt;
                }
                storeName = enc;
                target = dir.resolve(storeName);
            }
        }

        // Write file (no encryption)
        try (InputStream in = multipartFile.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }

        HttpFile ret = new HttpFile();
        ret.setOid(oid);
        ret.setType(type);
        ret.setOrgNm(originalName);
        ret.setConvNm(storeName);
        ret.setExt(getExtension(originalName));
        long size = multipartFile.getSize();
        ret.setFileSize(size > Integer.MAX_VALUE ? Integer.MAX_VALUE : (int) size);
        return ret;
    }

    /**
     * Save BOM file variant (handles path-like original names and sets tempPartNo)
     */
    public HttpFile saveBomFile(String type, Integer oid, String tempPartNo, MultipartFile multipartFile) throws Exception {
        HttpFile file = saveFile(type, oid, multipartFile);
        if (file != null) {
            file.setTempPartNo(tempPartNo);
        }
        return file;
    }

    /**
     * Copy an existing stored file to a new OID folder (revise)
     */
    public HttpFile reviseFile(HttpFile httpFile, int newOid) throws Exception {
        if (httpFile == null || StringUtils.isBlank(httpFile.getConvNm())) return httpFile;

        Path oldDir = buildVaultDir(httpFile.getType(), httpFile.getOid());
        Path newDir = buildVaultDir(httpFile.getType(), newOid);
        ensureDirectory(newDir);

        Path source = oldDir.resolve(httpFile.getConvNm());
        Path dest = newDir.resolve(httpFile.getConvNm());
        if (Files.exists(source)) {
            Files.copy(source, dest, StandardCopyOption.REPLACE_EXISTING);
        }
        // Update OID in model for convenience
        httpFile.setOid(newOid);
        return httpFile;
    }

    /**
     * Delete a stored file
     */
    public void fileDelete(HttpFile httpFile) {
        try {
            if (httpFile == null || StringUtils.isBlank(httpFile.getConvNm())) return;
            Path dir = buildVaultDir(httpFile.getType(), httpFile.getOid());
            Path file = dir.resolve(httpFile.getConvNm());
            Files.deleteIfExists(file);
        } catch (Exception ex) {
            log.warn("Failed to delete file: {}", ex.getMessage());
        }
    }

    /**
     * Get a readable stream to the stored file. In C# this copied and decrypted to temp.
     * Here we copy to temp folder and return stream for that copy to mimic behavior.
     */
    public InputStream getFileStream(HttpFile fileModel) throws Exception {
        if (fileModel == null || StringUtils.isBlank(fileModel.getConvNm())) {
            throw new FileNotFoundException("파일이 존재하지 않습니다.");
        }
        Path vaultDir = buildVaultDir(fileModel.getType(), fileModel.getOid());
        Path source = vaultDir.resolve(fileModel.getConvNm());
        if (!Files.exists(source)) {
            throw new FileNotFoundException("파일이 존재하지 않습니다.");
        }
        Path tempRoot = Paths.get(getRootStorage(), getTempPath());
        ensureDirectory(tempRoot);
        Path tempTarget = tempRoot.resolve(fileModel.getConvNm());

        // Copy (no encryption/decryption)
        Files.copy(source, tempTarget, StandardCopyOption.REPLACE_EXISTING);
        return new BufferedInputStream(Files.newInputStream(tempTarget));
    }

    /**
     * Prepare a file under AutoVue temp root and return the relative path for client usage.
     */
    public String getFileString(HttpFile fileModel) throws Exception {
        if (fileModel == null || StringUtils.isBlank(fileModel.getConvNm())) {
            throw new FileNotFoundException("파일이 존재하지 않습니다.");
        }
        Path vaultDir = buildVaultDir(fileModel.getType(), fileModel.getOid());
        Path source = vaultDir.resolve(fileModel.getConvNm());

        Path autoVueRoot = Paths.get(getAutoVueTempRoot());
        Path subTemp = Paths.get(getTempPath());
        Path targetDir = autoVueRoot.resolve(subTemp);
        ensureDirectory(targetDir);

        // Use original name for user-facing AutoVue temp
        String outName = StringUtils.defaultIfBlank(fileModel.getOrgNm(), fileModel.getConvNm());
        Path target = targetDir.resolve(outName);

        Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);

        // Return relative path (remove the root prefix)
        String rel = autoVueRoot.relativize(target).toString();
        // Normalize to URL-style
        return ("/" + rel).replace("\\", "/");
    }
}
