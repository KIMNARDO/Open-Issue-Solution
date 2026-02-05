package com.papsnet.openissue.common.service;

import com.papsnet.openissue.common.dto.DObject;
import com.papsnet.openissue.common.dto.FileLocalStorageConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Locale;

/**
 * ImageService
 * - Save uploaded image files into "images/Thumbnail" under local storage root
 * - Optionally update DObject.Thumbnail when OID is provided
 * - Self-contained: does not rely on FileLocalStorageService
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ImageService {

    private static final String THUMBNAIL_SUB_DIR = "images/Thumbnail";

    private final FileLocalStorageConfig storageConfig;
    private final DObjectService dObjectService;

    /**
     * Save a single image file as thumbnail and optionally update DObject thumbnail.
     *
     * @param oidString object id as string (nullable/blank allowed)
     * @param file      image multipart file
     * @return saved file name (store name)
     * @throws Exception on failure
     */
    @Transactional
    public String uploadThumbnail(String oidString, MultipartFile file) throws Exception {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 없습니다.");
        }
        if (!isImageFile(file)) {
            throw new IllegalArgumentException("이미지 파일(jpg, jpeg, png, gif)만 업로드 가능합니다.");
        }

        // Prepare directory under upload root dir
        String root = Paths.get(storageConfig.getUploadRootDir()).toAbsolutePath().normalize().toString();
        Path dir = Paths.get(root, THUMBNAIL_SUB_DIR).toAbsolutePath().normalize();
        ensureDirectory(dir);

        // Build stored file name using timestamp rule
        String originalFileName = file.getOriginalFilename();
        String ext = getExtension(originalFileName);
        if (StringUtils.isBlank(ext)) {
            throw new IllegalArgumentException("파일 확장자를 확인할 수 없습니다.");
        }
        String storeName = getTimestamp() + "." + ext.toLowerCase(Locale.ROOT);

        // Save the file
        Path target = dir.resolve(storeName);
        file.transferTo(new File(target.toString()));

        String fileName = storeName;

        // Update DObject thumbnail if OID is provided
        if (StringUtils.isNotBlank(oidString)) {
            try {
                Integer oid = Integer.valueOf(oidString);
                DObject update = DObject.builder().oid(oid).thumbnail(fileName).build();
                dObjectService.udtDObject(update);
            } catch (NumberFormatException nfe) {
                log.warn("Invalid OID provided for thumbnail update: {}", oidString);
            }
        }
        return fileName;
    }

    private static void ensureDirectory(Path dir) throws Exception {
        if (!Files.exists(dir)) {
            Files.createDirectories(dir);
        }
    }

    private static String getExtension(String name) {
        if (name == null) return null;
        String n = name.replace("\\", "/");
        int idx = n.lastIndexOf('/');
        if (idx >= 0) {
            n = n.substring(idx + 1);
        }
        int dot = n.lastIndexOf('.');
        return dot >= 0 ? n.substring(dot + 1) : null;
    }

    private static String getTimestamp() {
        SimpleDateFormat sdfCurrent = new SimpleDateFormat("yyyyMMddhhmmssSSS", Locale.KOREA);
        Timestamp ts = new Timestamp(System.currentTimeMillis());
        return sdfCurrent.format(ts.getTime());
    }

    private static boolean isImageFile(MultipartFile file) {
        if (file == null) return false;
        String original = file.getOriginalFilename();
        String ext = getExtension(original);
        if (StringUtils.isBlank(ext)) return false;
        String e = ext.toLowerCase(Locale.ROOT);
        return e.equals("jpeg") || e.equals("jpg") || e.equals("png") || e.equals("gif");
    }
}
