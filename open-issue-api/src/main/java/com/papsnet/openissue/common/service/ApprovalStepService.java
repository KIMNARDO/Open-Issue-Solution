package com.papsnet.openissue.common.service;

import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.ApprovalStep;
import com.papsnet.openissue.common.dto.ApprovalTask;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalStepService {
    private final CommonDAO commonDAO;
    private final ApprovalTaskService approvalTaskService;

    // SelApprovalStep: fetch single step and populate inbox tasks
    @Transactional(readOnly = true)
    public ApprovalStep SelApprovalStep(ApprovalStep param) {
        List<ApprovalStep> steps = commonDAO.selApprovalStep(param);
        if (steps == null || steps.isEmpty()) return null;
        ApprovalStep step = steps.get(0);
        List<ApprovalTask> tasks = approvalTaskService.SelInboxTasks(ApprovalTask.builder().stepOID(step.getOid()).build());
        step.setInboxTask(tasks);
        return step;
    }

    // SelApprovalSteps: fetch multiple steps and populate each one's inbox tasks
    @Transactional(readOnly = true)
    public List<ApprovalStep> SelApprovalSteps(ApprovalStep param) {
        List<ApprovalStep> steps = commonDAO.selApprovalStep(param);
        if (steps == null || steps.isEmpty()) return List.of();
        steps.forEach(step -> {
            List<ApprovalTask> tasks = approvalTaskService.SelInboxTasks(ApprovalTask.builder().stepOID(step.getOid()).build());
            step.setInboxTask(tasks);
        });
        return steps;
    }

    // InsApprovalStep: insert a step (OID pre-allocated in mapper)
    @Transactional
    public int InsApprovalStep(ApprovalStep param) {
        return commonDAO.insApprovalStep(param);
    }
}
