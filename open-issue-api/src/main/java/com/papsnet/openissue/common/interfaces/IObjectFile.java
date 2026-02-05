package com.papsnet.openissue.common.interfaces;

import com.papsnet.openissue.common.dto.AttachFile;
import com.papsnet.openissue.common.dto.AttachFileDtl;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 파일 첨부 기능을 가진 객체를 위한 인터페이스
 */
public interface IObjectFile {
    /**
     * 첨부 파일 목록을 가져옵니다.
     * @return 첨부 파일 목록
     */
    List<MultipartFile> getFiles();
    
    /**
     * 첨부 파일 목록을 설정합니다.
     * @param files 첨부 파일 목록
     */
    void setFiles(List<MultipartFile> files);
    
    /**
     * 삭제할 파일 목록을 가져옵니다.
     * @return 삭제할 파일 목록
     */
    List<AttachFileDtl> getDelFiles();
    
    /**
     * 삭제할 파일 목록을 설정합니다.
     * @param delFiles 삭제할 파일 목록
     */
    void setDelFiles(List<AttachFileDtl> delFiles);
}