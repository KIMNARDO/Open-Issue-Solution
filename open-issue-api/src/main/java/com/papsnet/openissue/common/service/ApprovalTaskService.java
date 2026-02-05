package com.papsnet.openissue.common.service;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.service.PersonService;
import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.Approval;
import com.papsnet.openissue.common.dto.ApprovalTask;
import com.papsnet.openissue.common.dto.BPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApprovalTaskService {
    private final CommonDAO commonDAO;
    private final PersonService personService;

    // Fetch tasks matching the given condition (used as Inbox tasks by StepOID, etc.)
    @Transactional(readOnly = true)
    public List<ApprovalTask> SelInboxTasks(ApprovalTask param) {
        List<ApprovalTask> tasks = commonDAO.selApprovalTask(param);
        if (tasks == null || tasks.isEmpty()) return List.of();
        // Enrich each task as per legacy logic: BPolicy + Person info
        tasks.forEach(task -> {
            // BPolicy
            if (task.getBpolicyOID() != null) {
                BPolicy p = new BPolicy();
                p.setOid(task.getBpolicyOID());
                task.setBpolicy(commonDAO.selBPolicy(p));
            }
            // Person
            if (task.getPersonOID() != null) {
                Person person = personService.selPersonByOid(task.getPersonOID());
                if (person != null) {
                    task.setPersonObj(person);
                    task.setPersonNm(person.getName());
                    task.setDepartmentNm(person.getDepartmentNm());
                }
            }
        });
        return tasks;
    }

    // SelInboxMyTasks: 내 결재함(시작/요청자 기준) 조회 및 보강
    @Transactional(readOnly = true)
    public List<ApprovalTask> SelInboxMyTasks(int reqUserUid, ApprovalTask param) {
        if (param == null) param = ApprovalTask.builder().build();
        // Load policy by param.bpolicyOID to decide filtering rule
        BPolicy polParam = new BPolicy();
        polParam.setOid(param.getBpolicyOID());
        BPolicy taskPolicy = commonDAO.selBPolicy(polParam);

        if (taskPolicy != null && CommonConstant.POLICY_APPROVAL_STARTED.equals(taskPolicy.getName())) {
            param.setPersonOID(reqUserUid);
        } else {
            param.setCreateUs(reqUserUid);
        }

        List<ApprovalTask> list = commonDAO.selMyApprovalTask(param);
        if (list == null || list.isEmpty()) return List.of();

        // If policy is APPROVAL_STARTED, include only tasks whose parent approval is also APPROVAL_STARTED
        if (taskPolicy != null && CommonConstant.POLICY_APPROVAL_STARTED.equals(taskPolicy.getName())) {
            List<ApprovalTask> filtered = new ArrayList<>();
            for (ApprovalTask t : list) {
                if (t.getApprovalOID() == null) continue;
                Approval aParam = new Approval();
                aParam.setOid(t.getApprovalOID());
                List<Approval> approvals = commonDAO.selApproval(aParam);
                if (approvals == null || approvals.isEmpty()) continue;
                Approval ap = approvals.get(0);
                if (ap.getBpolicyOID() == null) continue;
                BPolicy apPolParam = new BPolicy();
                apPolParam.setOid(ap.getBpolicyOID());
                BPolicy apPolicy = commonDAO.selBPolicy(apPolParam);
                if (apPolicy != null && CommonConstant.POLICY_APPROVAL_STARTED.equals(apPolicy.getName())) {
                    filtered.add(t);
                }
            }
            filtered.forEach(this::enrichTask);
            return filtered;
        } else {
            list.forEach(this::enrichTask);
            return list;
        }
    }

    // 결재중/완료 결재 리스트 조회
    @Transactional(readOnly = true)
    public List<ApprovalTask> SelInboxMyPayTasks(int reqUserUid, ApprovalTask param) {
        // Load policies for Approval and ApprovalTask by type
        List<BPolicy> approvalPolicies = commonDAO.selBPolicys(new BPolicy(CommonConstant.TYPE_APPROVAL, null));
        List<BPolicy> taskPolicies = commonDAO.selBPolicys(new BPolicy(CommonConstant.TYPE_APPROVAL_TASK, null));

        Integer approvalStarted = findPolicyOidByName(approvalPolicies, CommonConstant.POLICY_APPROVAL_STARTED);
        Integer approvalCompleted = findPolicyOidByName(approvalPolicies, CommonConstant.POLICY_APPROVAL_COMPLETED);
        Integer paying = findPolicyOidByName(taskPolicies, CommonConstant.POLICY_APPROVAL_TASK_PAYING);

        ApprovalTask payparam = new ApprovalTask();
        payparam.setPersonOID(reqUserUid);
        payparam.setCreateUs(reqUserUid);
        if (param != null && Objects.equals(param.getBpolicyOID(), paying)) {
            payparam.setBpolicyOID(approvalStarted);
        } else {
            payparam.setBpolicyOID(approvalCompleted);
        }

        // Queries (lApproval is not used further in original logic but we keep the call for parity)
        commonDAO.selMyPayingApproval(new Approval());
        List<ApprovalTask> tasks = commonDAO.selMyPayingApprovalTask(payparam);
        if (tasks == null || tasks.isEmpty()) return List.of();

        // Enrich each task
        tasks.forEach(t -> {
            // creator
            if (t.getCreateUs() != null) {
                Person cu = personService.selPersonByOid(t.getCreateUs());
                if (cu != null) t.setCreateUsNm(cu.getName());
            }
            // task policy
            if (t.getBpolicyOID() != null) {
                BPolicy bp = new BPolicy();
                bp.setOid(t.getBpolicyOID());
                BPolicy full = commonDAO.selBPolicy(bp);
                t.setBpolicy(full);
            }
            // assignee
            if (t.getPersonOID() != null) {
                Person p = personService.selPersonByOid(t.getPersonOID());
                if (p != null) {
                    t.setPersonObj(p);
                    t.setPersonNm(p.getName());
                    t.setDepartmentNm(p.getDepartmentNm());
                }
            }
        });
        return tasks;
    }

    // Insert inbox task
    @Transactional
    public int InsInboxTask(ApprovalTask param) {
        return commonDAO.insApprovalTask(param);
    }

    // Update inbox task (action/comment)
    @Transactional
    public int UdtInboxTask(ApprovalTask param) {
        return commonDAO.udtInboxTask(param);
    }

    // Helpers
    private Integer findPolicyOidByName(List<BPolicy> list, String name) {
        if (list == null) return null;
        return list.stream().filter(p -> name.equals(p.getName())).map(BPolicy::getOid).findFirst().orElse(null);
    }

    private void enrichTask(ApprovalTask task) {
        if (task == null) return;
        // BPolicy
        if (task.getBpolicyOID() != null) {
            BPolicy p = new BPolicy();
            p.setOid(task.getBpolicyOID());
            task.setBpolicy(commonDAO.selBPolicy(p));
        }
        // Person
        if (task.getPersonOID() != null) {
            Person person = personService.selPersonByOid(task.getPersonOID());
            if (person != null) {
                task.setPersonObj(person);
                task.setPersonNm(person.getName());
                task.setDepartmentNm(person.getDepartmentNm());
            }
        }
        // Creator name
        if (task.getCreateUs() != null) {
            Person creator = personService.selPersonByOid(task.getCreateUs());
            if (creator != null) task.setCreateUsNm(creator.getName());
        }
    }
}
