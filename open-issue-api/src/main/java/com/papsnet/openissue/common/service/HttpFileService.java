package com.papsnet.openissue.common.service;

import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.HttpFile;
import com.papsnet.openissue.util.SemsValut;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpSession;
import java.util.List;

/**
 * Java Spring version of legacy C# InsertData for handling Http file inserts.
 * - Saves physical files using SemsValut
 * - Inserts metadata into T_DFILE via CommonDAO.insFile
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class HttpFileService {

    private final CommonDAO commonDAO;
    private final SemsValut semsValut;

    /**
     * Insert files associated with an object.
     * Mirrors the C# pattern: for each file, save and insert a record; if one fails, clean up the saved file and rethrow.
     *
     * @param reqUserUid HttpSession (expects attribute "UserOID")
     * @param oid        Target object OID (nullable for temporary cases)
     * @param type       Target object type (used for both DB and subdirectory)
     * @param files      Files to upload
     * @param row        Optional row number
     * @param tempPartNo Optional temp part number
     */
    @Transactional
    public void insertData(Integer reqUserUid,
                           Integer oid,
                           String type,
                           List<MultipartFile> files,
                           Integer row,
                           String tempPartNo) throws Exception {
        if (files == null || files.isEmpty()) {
            return; // nothing to do
        }

        Integer userOid = reqUserUid;

        try {
            for (MultipartFile mf : files) {
                if (mf == null || mf.isEmpty()) continue;

                // Save physical file using SemsValut (uses AES name logic for storeName)
                HttpFile file = semsValut.saveFile(type, oid, mf);
                if (file == null) continue; // skip invalid file

                // Set additional metadata
                file.setCreateUs(userOid);
                file.setRow(row);
                file.setTempPartNo(tempPartNo);

                // Insert metadata
                commonDAO.insFile(file);
            }
        } catch (Exception ex) {
            throw ex;
        }
    }


    @Transactional
    public void insertBomFileData(Integer reqUserUid,
                                  Integer oid,
                                  String type,
                                  List<org.springframework.web.multipart.MultipartFile> files,
                                  Integer row,
                                  String tempPartNo) throws Exception {
        if (files == null || files.isEmpty()) return;
        Integer userOid = reqUserUid;
        for (org.springframework.web.multipart.MultipartFile mf : files) {
            if (mf == null || mf.isEmpty()) continue;
            HttpFile file = null;
            try {
                file = semsValut.saveBomFile(type, oid, tempPartNo, mf);
                if (file == null) continue;
                file.setCreateUs(userOid);
                file.setRow(row);
                file.setTempPartNo(tempPartNo);
                commonDAO.insFile(file);
            } catch (Exception ex) {
                if (file != null) {
                    try { semsValut.fileDelete(file); } catch (Exception ignore) { }
                }
                throw ex;
            }
        }
    }

    public HttpFile selFile(HttpFile cond) {
        List<HttpFile> list = commonDAO.selFile(cond);
        if (list == null || list.isEmpty()) return null;
        return list.get(0);
    }

    public List<HttpFile> selFiles(HttpFile cond) {
        if (cond == null) return null;
        if (cond.getType() == null && (cond.getOid() == null && cond.getFileOid() == null)) return null;
        return commonDAO.selFile(cond);
    }

    @Transactional
    public int deleteData(Integer reqUserUid, HttpFile httpFile) throws Exception {
        if (httpFile == null || httpFile.getFileOid() == null) {
            throw new Exception("파일을 삭제할 수 없습니다.");
        }
        httpFile.setDeleteUs(reqUserUid);
        HttpFile found = selFile(httpFile);
        if (found != null) {
            semsValut.fileDelete(found);
        }
        Integer cnt = commonDAO.delFile(httpFile);
        return cnt == null ? 0 : cnt;
    }

    @Transactional
    public int deleteBomFileData(Integer reqUserUid, HttpFile httpFile) throws Exception {
        httpFile.setDeleteUs(reqUserUid);
        HttpFile found = selFile(httpFile);
        if (found != null) {
            httpFile.setFileOid(found.getFileOid());
            semsValut.fileDelete(found);
        }
        Integer cnt = commonDAO.delFile(httpFile);
        return cnt == null ? 0 : cnt;
    }

    @Transactional
    public HttpFile reviseFiles(Integer reqUserUid, HttpFile cond, int newOid) throws Exception {
        if (cond == null || cond.getOid() == null) return null;
        List<HttpFile> list = selFiles(cond);
        if (list != null && !list.isEmpty() && newOid > 0) {
            for (HttpFile v : list) {
                semsValut.reviseFile(v, newOid);
                v.setOid(newOid);
                v.setCreateUs(reqUserUid);
                commonDAO.insFile(v);
            }
        }
        return cond;
    }
}
