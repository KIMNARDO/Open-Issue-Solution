package com.papsnet.openissue.common.dao;

import com.papsnet.openissue.common.dto.DocClass;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DocumentClassificationDAO {
    List<DocClass> selDocClass(DocClass param);
    List<DocClass> selAllDocClass(DocClass param);
    List<DocClass> selectDocClassTree(Integer rootOid);
    int insDocClass(DocClass data);
    int updateDocClass(DocClass data);
    int deleteDocClass(DocClass data);
}
