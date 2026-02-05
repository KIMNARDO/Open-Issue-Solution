package com.papsnet.openissue.common.service;

import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.constant.PmsConstant;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dao.DLibraryDAO;
import com.papsnet.openissue.common.dto.DLibrary;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class DLibraryService {
    private final DLibraryDAO dLibraryDAO;
    private final DObjectService dObjectService;
    private final CommonDAO commonDAO;
    private final BPolicyService bpolicyService;

    public DLibrary selSingleLibrary(String korNm) throws Exception {
        return dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(korNm).build());
    }

    public List<DLibrary> selLibraryObjects(@Nullable Integer fromOID) throws Exception {
        return dLibraryDAO.selLibrary(DLibrary.builder()
                        .fromOID(fromOID)
                        .build());
    }

    public Map<String, List<DLibrary>> selSessionLibraries() throws Exception {
       Map<String, List<DLibrary>> result = new HashMap<>();

        Integer issueTypeOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(PmsConstant.ATTRIBUTE_ISSUE_TYPE).build()).getOid();
        result.put("issueType", dLibraryDAO.selLibrary(DLibrary.builder().fromOID(issueTypeOID).build()));

        Integer issueStateOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(PmsConstant.ATTRIBUTE_ISSUE_STATE).build()).getOid();
        result.put("issueState", dLibraryDAO.selLibrary(DLibrary.builder().fromOID(issueStateOID).build()));
        Integer issuePlaceOfIssueOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(PmsConstant.ATTRIBUTE_ISSUE_PLACEOFISSUE).build()).getOid();
        result.put("placeOfIssue", dLibraryDAO.selLibrary(DLibrary.builder().fromOID(issuePlaceOfIssueOID).build()));

        result.put("oem", dLibraryDAO.selCodeLibrary(DLibrary.builder().fromOID(CommonConstant.OEM_OID).build()));
        result.put("item", dLibraryDAO.selCodeLibrary(DLibrary.builder().fromOID(CommonConstant.ITEM_GROUP_OID).build()));

        Integer productionSiteOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(CommonConstant.ATTRIBUTE_PRODUCTION_SITE).build()).getOid();
        result.put("productionSite", dLibraryDAO.selLibrary(DLibrary.builder().fromOID(productionSiteOID).build()));

        Integer custKey = dLibraryDAO.selSingleLibrary(DLibrary.builder().name(CommonConstant.ATTRIBUTE_CUSTOMER).build()).getOid();
        result.put("customer", dLibraryDAO.selLibrary(DLibrary.builder().fromOID(custKey).build()));

        Integer nationOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(CommonConstant.NATION_LIBRARY).build()).getOid();
        result.put("nation", dLibraryDAO.selLibrary(DLibrary.builder().fromOID(nationOID).build()));

        Integer jobGroupOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(CommonConstant.JOBGROUP_LIBRARY).build()).getOid();
        result.put("jobGroupOID", dLibraryDAO.selLibrary(DLibrary.builder().fromOID(jobGroupOID).build()));

        Integer jobPositionOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(CommonConstant.JOBPOSITION_LIBRARY ).build()).getOid();
        result.put("jobPositionOID", dLibraryDAO.selLibrary(DLibrary.builder().fromOID(jobPositionOID).build()));

        Integer jobTitle = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(CommonConstant.JOB_TITLE_LIBRARY).build()).getOid();
        result.put("jobTitle", dLibraryDAO.selLibrary(DLibrary.builder().fromOID(jobTitle).build()));

       return result;
    }

    @Transactional(readOnly = true)
    public DLibrary modifyLibrary(DLibrary data) {
        try {
            commonDAO.udtDObject(data);
            dLibraryDAO.updateLibrary(data);
            return data;
        } catch (Exception e) {
            log.error("{} modifyLibrary {}", this.getClass().getSimpleName(), e.getMessage());
            return null;
        }
    }


    @Transactional(readOnly = true)
    public List<DLibrary> selChildLibraries(String code) throws Exception {

        DLibrary parentParam = new DLibrary();
        parentParam.setName(code);
        parentParam.setType(CommonConstant.TYPE_LIBRARY);
        DLibrary parentData = dLibraryDAO.selSingleLibrary(parentParam);

        DLibrary cond = new DLibrary();
        cond.setFromOID(parentData.getOid());
        cond.setType(CommonConstant.TYPE_LIBRARY);

        return dLibraryDAO.selLibrary(cond);
    }

    // region Ported methods from C# LibraryService
    @Transactional
    public int updateLibrary(DLibrary param) {
        return dLibraryDAO.updateLibrary(param);
    }

    @Transactional(readOnly = true)
    public List<DLibrary> SelLibrary(DLibrary param) throws Exception {
        param.setType(CommonConstant.TYPE_LIBRARY);
        return dLibraryDAO.selLibrary(param);
    }

    @Transactional(readOnly = true)
    public List<DLibrary> AllSelLibrary(DLibrary param) throws Exception {
        param.setType(CommonConstant.TYPE_LIBRARY);
        return dLibraryDAO.selAllLibrary(param);
    }

    @Transactional(readOnly = true)
    public DLibrary SelLibraryObject(DLibrary param) throws Exception {
        param.setType(CommonConstant.TYPE_LIBRARY);
        List<DLibrary> list = dLibraryDAO.selAllLibrary(param);
        return (list != null && !list.isEmpty()) ? list.get(0) : null;
    }

    @Transactional(readOnly = true)
    public DLibrary selSingleLibrary(DLibrary param) throws Exception {
        param.setType(CommonConstant.TYPE_LIBRARY);
        return dLibraryDAO.selSingleLibrary(param);
    }

    // region Code Library
    @Transactional
    public int updateCodeLibrary(DLibrary param) {
        return dLibraryDAO.updateCodeLibrary(param);
    }

    @Transactional
    public int deleteCodeLibrary(DLibrary param) {
        return dLibraryDAO.deleteCodeLibrary(param);
    }

    @Transactional(readOnly = true)
    public List<DLibrary> SelCodeLibrary(DLibrary param) throws Exception {
        return dLibraryDAO.selCodeLibrary(param);
    }

    @Transactional(readOnly = true)
    public List<DLibrary> AllSelCodeLibrary(DLibrary param) throws Exception {
        return dLibraryDAO.selAllCodeLibrary(param);
    }

    @Transactional(readOnly = true)
    public DLibrary SelCodeLibraryObject(DLibrary param) throws Exception {
        List<DLibrary> list = dLibraryDAO.selAllCodeLibrary(param);
        return (list != null && !list.isEmpty()) ? list.get(0) : null;
    }

    @Transactional(readOnly = true)
    public List<DLibrary> SelCodeLibraryChild(DLibrary param) throws Exception {
        DLibrary temp = dLibraryDAO.selCodeLibrary(param).stream().findFirst().orElse(null);
        if (temp == null) return List.of();
        DLibrary childCond = DLibrary.builder().fromOID(temp.getOid()).build();
        return dLibraryDAO.selCodeLibrary(childCond);
    }
    // endregion

    @Transactional(readOnly = true)
    public List<DLibrary> SelLibraryObjects(DLibrary param) throws Exception {
        param.setType(CommonConstant.TYPE_LIBRARY);
        return dLibraryDAO.selAllLibrary(param);
    }

    // region Assess Library
    @Transactional(readOnly = true)
    public List<DLibrary> SelAssessLibrary(DLibrary param) throws Exception {
        return dLibraryDAO.selAssessLibrary(param);
    }

    @Transactional(readOnly = true)
    public List<DLibrary> SelAssessLibraryLatest(DLibrary param) throws Exception {
        return dLibraryDAO.selAssessLibraryLatest(param);
    }

    @Transactional(readOnly = true)
    public DLibrary SelAssessLibraryObject(DLibrary param) throws Exception {
        List<DLibrary> list = dLibraryDAO.selAssessLibrary(param);
        return (list != null && !list.isEmpty()) ? list.get(0) : null;
    }

    @Transactional(readOnly = true)
    public List<DLibrary> SelAssessLibraryChild(DLibrary param) throws Exception {
        return dLibraryDAO.selAssessLibrarySub(param);
    }

    @Transactional
    public int UpdateAssessIsLatest(DLibrary param) {
        return dLibraryDAO.updateAssessIsLatest(param);
    }
    // endregion

    // region Customer Schedule Template
    @Transactional(readOnly = true)
    public List<DLibrary> SelCustomerScheduleTemplate(DLibrary param) throws Exception {
        return dLibraryDAO.selCustomerScheduleTemplate(param);
    }

    @Transactional(readOnly = true)
    public List<DLibrary> SelCustomerScheduleTemplateChild(DLibrary param) throws Exception {
        return dLibraryDAO.selCustomerScheduleTemplateSub(param);
    }

    @Transactional
    public int delCustomerScheduleTemplateSub(DLibrary param) {
        return dLibraryDAO.delCustomerScheduleTemplateSub(param);
    }
    // endregion

    // Additional service methods for create/delete and assess updates
    @Transactional
    public Integer insertLibrary(DLibrary param) {
        // Create DObject first
        param.setType(CommonConstant.TYPE_LIBRARY);
        Integer oid = dObjectService.insDObject(param);
        param.setOid(oid);
        dLibraryDAO.insLibrary(param);
        return oid;
    }

    @Transactional
    public int delLibrary(DLibrary param) {
        // Soft delete DObject
        return commonDAO.delDObject(param);
    }

    @Transactional
    public int insertCodeLibrary(DLibrary param) {
        return dLibraryDAO.insCodeLibrary(param);
    }

    @Transactional
    public int updateAssessLibrary(List<DLibrary> params, Integer reqUserUid) {
        int lastParentOid = 0;
        int affected = 0;
        int idx = 0;
        for (DLibrary parent : params) {
            idx++;
            // When parent order changed
            if ("Y".equalsIgnoreCase(nullToEmpty(parent.getIsParentMove()))) {
                if ("Y".equalsIgnoreCase(nullToEmpty(parent.getIsChange()))) {
                    // Parent revision up: set latest=0 and insert new row with children
                    dLibraryDAO.updateAssessIsLatest(parent);
                    parent.setRevision(makeMajorRevisionUp(parent.getRevision()));
                    parent.setOrd(idx);
                    parent.setCreateUs(reqUserUid);
                    lastParentOid = dLibraryDAO.insAssessParent(parent);
                    int cOrd = 1;
                    if (parent.getCData() != null) {
                        for (DLibrary child : parent.getCData()) {
                            child.setFromOID(lastParentOid);
                            child.setOrd(cOrd++);
                            affected += dLibraryDAO.insAssessChild(child);
                        }
                    }
                } else if ("Y".equalsIgnoreCase(nullToEmpty(parent.getIsMove()))) {
                    // Only order changed; update parent and children orders
                    parent.setOrd(idx);
                    affected += dLibraryDAO.updateAssessParentOrd(parent);
                    int cOrd = 1;
                    if (parent.getCData() != null) {
                        for (DLibrary child : parent.getCData()) {
                            child.setFromOID(parent.getOid());
                            child.setOrd(cOrd++);
                            affected += dLibraryDAO.updateAssessChildOrd(child);
                        }
                    }
                } else if ("Y".equalsIgnoreCase(nullToEmpty(parent.getIsDelete()))) {
                    parent.setDeleteUs(reqUserUid);
                    affected += dLibraryDAO.deleteAssessLibrary(parent);
                } else {
                    // Only parent order changed
                    parent.setOrd(idx);
                    affected += dLibraryDAO.updateAssessParentOrd(parent);
                }
            } else {
                // parent order not changed
                if ("Y".equalsIgnoreCase(nullToEmpty(parent.getIsChange()))) {
                    dLibraryDAO.updateAssessIsLatest(parent);
                    parent.setRevision(makeMajorRevisionUp(parent.getRevision()));
                    parent.setOrd(idx);
                    parent.setCreateUs(reqUserUid);
                    lastParentOid = dLibraryDAO.insAssessParent(parent);
                    int cOrd = 1;
                    if (parent.getCData() != null) {
                        for (DLibrary child : parent.getCData()) {
                            child.setFromOID(lastParentOid);
                            child.setOrd(cOrd++);
                            affected += dLibraryDAO.insAssessChild(child);
                        }
                    }
                } else if ("Y".equalsIgnoreCase(nullToEmpty(parent.getIsMove()))) {
                    int cOrd = 1;
                    if (parent.getCData() != null) {
                        for (DLibrary child : parent.getCData()) {
                            child.setFromOID(parent.getOid());
                            child.setOrd(cOrd++);
                            affected += dLibraryDAO.updateAssessChildOrd(child);
                        }
                    }
                } else if ("Y".equalsIgnoreCase(nullToEmpty(parent.getIsDelete()))) {
                    parent.setDeleteUs(reqUserUid);
                    affected += dLibraryDAO.deleteAssessLibrary(parent);
                }
            }
        }
        return affected;
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }

    private static String makeMajorRevisionUp(String rev) {
        if (rev == null || rev.isEmpty()) {
            return CommonConstant.REVISION_PREFIX + CommonConstant.INIT_REVISION;
        }
        try {
            String prefix = CommonConstant.REVISION_PREFIX;
            String numStr = rev.startsWith(prefix) ? rev.substring(prefix.length()) : rev;
            int num = Integer.parseInt(numStr);
            num += 1;
            return prefix + String.format("%02d", num);
        } catch (Exception e) {
            return rev;
        }
    }

    // endregion
}
