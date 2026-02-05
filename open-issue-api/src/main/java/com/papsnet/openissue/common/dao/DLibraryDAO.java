package com.papsnet.openissue.common.dao;

import com.papsnet.openissue.common.dto.DLibrary;
import com.papsnet.openissue.common.dto.DocClass;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface DLibraryDAO {
    // Library (T_DOBJECT, T_DLIBRARY)
    DLibrary selSingleLibrary(DLibrary param);
    List<DLibrary> selLibrary(DLibrary param);
    List<DLibrary> selAllLibrary(DLibrary param);

    // Code Library (T_DCODELIBRARY)
    List<DLibrary> selCodeLibrary(DLibrary param);
    List<DLibrary> selAllCodeLibrary(DLibrary param);

    int insLibrary(DLibrary data);
    int updateLibrary(DLibrary data);

    int insCodeLibrary(DLibrary data);
    int updateCodeLibrary(DLibrary data);
    int deleteCodeLibrary(DLibrary data);

    // Document Classification (T_DDOCUMENT_CLASSIFICATION)
    List<DocClass> selDocClass(DocClass param);
    List<DocClass> selAllDocClass(DocClass param);
    int insDocClass(DocClass data);
    int updateDocClass(DocClass data);
    int deleteDocClass(DocClass data);

    // Assess Library
    List<DLibrary> selAssessLibrary(DLibrary param);
    List<DLibrary> selAssessLibraryLatest(DLibrary param);
    List<DLibrary> selAssessLibrarySub(DLibrary param);

    int updateAssessIsLatest(DLibrary data);
    int updateAssessChildOrd(DLibrary data);
    int updateAssessParentOrd(DLibrary data);

    int insAssessParent(DLibrary data);
    int insAssessChild(DLibrary data);
    int deleteAssessLibrary(DLibrary data);

    // Customer Schedule Template
    List<DLibrary> selCustomerScheduleTemplate(DLibrary param);
    List<DLibrary> selCustomerScheduleTemplateSub(DLibrary param);

    int updateCustomerScheduleTemplateSubOrd(DLibrary data);
    int updateCustomerScheduleTemplate(DLibrary data);
    int inCustomerScheduleTemplate(DLibrary data);
    int inCustomerScheduleTemplateSub(DLibrary data);
    int delCustomerScheduleTemplate(DLibrary data);
    int delCustomerScheduleTemplateSub(DLibrary data);
}
