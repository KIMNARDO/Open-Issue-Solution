package com.papsnet.openissue.common.service;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.service.PersonService;
import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ApprovalService {
    private final CommonDAO commonDAO;
    private final ApprovalStepService approvalStepService;
    private final ApprovalCommentService approvalCommentService;
    private final PersonService personService;

    // Non-step list
    @Transactional(readOnly = true)
    public List<Approval> SelApprovalsNonStep(Approval param) {
        List<Approval> list = commonDAO.selApproval(param);
        return list == null ? List.of() : list;
    }

    // Non-step single
    @Transactional(readOnly = true)
    public Approval SelApprovalNonStep(Approval param) {
        List<Approval> list = commonDAO.selApproval(param);
        return (list != null && !list.isEmpty()) ? list.get(0) : null;
    }

    // Save-filtered (by creator) non-step list
    @Transactional(readOnly = true)
    public List<Approval> SelSaveApprovalsNonStep(int reqUserUid, Approval param) {
        if (param == null) param = new Approval();
        param.setCreateUs(reqUserUid);
        List<Approval> list = commonDAO.selApproval(param);
        return list == null ? List.of() : list;
    }

    // Single approval with steps and comments
    @Transactional(readOnly = true)
    public Approval SelApproval(int reqUserUid, Approval param) {
        Approval tmp = SelApprovalNonStep(param);
        if (tmp != null && tmp.getOid() != null) {
            // Steps
            List<ApprovalStep> steps = approvalStepService.SelApprovalSteps(ApprovalStep.builder().approvalOID(tmp.getOid()).build());
            tmp.setInboxStep(steps);
            // Comments
            List<ApprovalComment> comments = approvalCommentService.SelApprovalComment(reqUserUid, ApprovalComment.builder().approvalOID(tmp.getOid()).build());
            tmp.setInboxCommnet(comments);
        }
        return tmp;
    }

    // List approvals with steps and comments
    @Transactional(readOnly = true)
    public List<Approval> SelApprovals(int reqUserUid, Approval param) {
        List<Approval> list = commonDAO.selApproval(param);
        if (list == null || list.isEmpty()) return List.of();
        list.forEach(app -> {
            if (app.getOid() == null) return;
            List<ApprovalStep> steps = approvalStepService.SelApprovalSteps(ApprovalStep.builder().approvalOID(app.getOid()).build());
            app.setInboxStep(steps);
            List<ApprovalComment> comments = approvalCommentService.SelApprovalComment(reqUserUid, ApprovalComment.builder().approvalOID(app.getOid()).build());
            app.setInboxCommnet(comments);
        });
        return list;
    }

    // 결재중/완료 결재 리스트 조회
    @Transactional(readOnly = true)
    public List<Approval> SelInboxMyPay(int reqUserUid, ApprovalTask param) {
        // Load policies by type
        List<BPolicy> approvalPolicies = commonDAO.selBPolicys(new BPolicy(CommonConstant.TYPE_APPROVAL, null));
        List<BPolicy> taskPolicies = commonDAO.selBPolicys(new BPolicy(CommonConstant.TYPE_APPROVAL_TASK, null));

        Integer approvalStarted = findPolicyOidByName(approvalPolicies, CommonConstant.POLICY_APPROVAL_STARTED);
        Integer approvalCompleted = findPolicyOidByName(approvalPolicies, CommonConstant.POLICY_APPROVAL_COMPLETED);
        Integer paying = findPolicyOidByName(taskPolicies, CommonConstant.POLICY_APPROVAL_TASK_PAYING);

        Approval payparam = new Approval();
        payparam.setPersonOID(reqUserUid);
        payparam.setCreateUs(reqUserUid);
        if (param != null && Objects.equals(param.getBpolicyOID(), paying)) {
            payparam.setBpolicyOID(approvalStarted);
        } else {
            payparam.setBpolicyOID(approvalCompleted);
        }

        List<Approval> approvals = commonDAO.selMyPayingApproval(payparam);
        if (approvals == null || approvals.isEmpty()) return List.of();

        approvals.forEach(appr -> {
            // Creator name
            if (appr.getCreateUs() != null) {
                Person p = personService.selPersonByOid(appr.getCreateUs());
                if (p != null) appr.setCreateUsNm(p.getName());
            }
            // Set BPolicy as selected by payparam (legacy behavior)
            if (payparam.getBpolicyOID() != null) {
                BPolicy bp = new BPolicy();
                bp.setOid(payparam.getBpolicyOID());
                appr.setBpolicy(commonDAO.selBPolicy(bp));
            }
            // ApprovalDt = ModifyDt
            appr.setApprovalDt(appr.getModifyDt());
        });
        return approvals;
    }

    // Insert approval
    @Transactional
    public int InsApproval(Approval param) {
        return commonDAO.insApproval(param);
    }

    // Update approval
    @Transactional
    public int UdtApproval(Approval param) {
        return commonDAO.udtApproval(param);
    }

    @Transactional(readOnly = true)
    public List<ApprovalTask> SelApprovalHistory(DObject param) {
        if (param == null || param.getOid() == null) return List.of();
        // Find the approval by TargetOID
        Approval cond = new Approval();
        cond.setTargetOID(param.getOid());
        Approval approval = SelApprovalNonStep(cond);
        if (approval == null || approval.getOid() == null) return List.of();

        // Load steps with their tasks
        List<ApprovalStep> steps = approvalStepService.SelApprovalSteps(ApprovalStep.builder().approvalOID(approval.getOid()).build());
        if (steps == null || steps.isEmpty()) return List.of();

        List<ApprovalTask> displayTask = new java.util.ArrayList<>();
        for (ApprovalStep step : steps) {
            if (step == null || step.getInboxTask() == null) continue;
            for (ApprovalTask task : step.getInboxTask()) {
                if (task == null) continue;
                task.setOrd(step.getOrd());
                task.setCurrentNum(approval.getCurrentNum());
                displayTask.add(task);
            }
        }
        return displayTask;
    }

    private Integer findPolicyOidByName(List<BPolicy> list, String name) {
        if (list == null) return null;
        return list.stream().filter(p -> name.equals(p.getName())).map(BPolicy::getOid).findFirst().orElse(null);
    }
}
