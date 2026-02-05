package com.papsnet.openissue.common.dao;

import com.papsnet.openissue.common.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CommonDAO {
    BPolicy selBPolicy(BPolicy param);
    List<BPolicy> selBPolicys(BPolicy param);

    List<BPolicyAuth> selBPolicyAuth(BPolicyAuth param);

    BDefine selBDefine(BDefine param);
    List<BDefine> selBDefines(BDefine param);

    String selTdmxOID(DObject _param);
    Integer selNameSeq (DObject _param);

    Integer udtLatestDObject (DObject _param);
    Integer udtReleaseLatestDObject (DObject _param);

    DObject selDObject(DObject _param);
    List<DObject> selDObjects(DObject _param);

    Integer insDObject(DObject _param);

    Integer udtDObject(DObject _param);
    Integer udtCreateUsDObject(DObject _param);
    Integer delDObject(DObject _param);
    Integer delDObjectBatch(DObject _param);
    Integer delThumbnailDObject(DObject _param);

    // DRelationship
    List<DRelationship> selRelationships(DRelationship param);
    List<DRelationship> selRecursionRelationship(DRelationship param);

    // File (T_DFILE)
    Integer insFile(HttpFile param);
    List<HttpFile> selFile(HttpFile param);
    Integer delFile(HttpFile param);

    // File History (T_DFILE_HISTORY)
    Integer insDFileHistory(DFileHistory param);
    List<DFileHistory> selDFileHistory(DFileHistory param);

    // Approval (T_DAPPROVAL)
    Integer insApproval(Approval param);
    List<Approval> selApproval(Approval param);
    Integer udtApproval(Approval param);

    // ApprovalStep (T_DAPPROVAL_STEP)
    Integer insApprovalStep(ApprovalStep param);
    List<ApprovalStep> selApprovalStep(ApprovalStep param);

    // ApprovalTask (T_DAPPROVAL_TASK)
    Integer insApprovalTask(ApprovalTask param);
    List<ApprovalTask> selApprovalTask(ApprovalTask param);
    List<ApprovalTask> selMyApprovalTask(ApprovalTask param);
    List<Approval> selMyPayingApproval(Approval param);
    List<ApprovalTask> selMyPayingApprovalTask(ApprovalTask param);
    Integer udtInboxTask(ApprovalTask param);

    // ApprovalComment (T_DAPPROVAL_COMMENT)
    Integer insApprovalComment(ApprovalComment param);
    List<ApprovalComment> selApprovalComment(ApprovalComment param);
    Integer udtApprovalComment(ApprovalComment param);
    Integer delApprovalComment(ApprovalComment param);

}
