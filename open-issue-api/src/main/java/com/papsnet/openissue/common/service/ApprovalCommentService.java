package com.papsnet.openissue.common.service;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.service.PersonService;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.ApprovalComment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApprovalCommentService {
    private final CommonDAO commonDAO;
    private final PersonService personService;

    // SelApprovalComment
    @Transactional(readOnly = true)
    public List<ApprovalComment> SelApprovalComment(int reqUserUid, ApprovalComment param) {
        List<ApprovalComment> list = commonDAO.selApprovalComment(param);
        if (list == null) return List.of();
        list.forEach(approvComment -> {
            Integer createUs = approvComment.getCreateUs();
            if (createUs != null) {
                Person p = personService.selPersonByOid(createUs);
                if (p != null) approvComment.setCreateUsNm(p.getName());
            }
        });
        return list;
    }

    // InsApprovalComment
    @Transactional
    public int InsApprovalComment(int reqUserUid, ApprovalComment param) {
        param.setCreateUs(reqUserUid);
        return commonDAO.insApprovalComment(param);
    }

    // DelApprovalComment (soft delete)
    @Transactional
    public int DelApprovalComment(int reqUserUid, ApprovalComment param) {
        param.setDeleteUs(reqUserUid);
        return commonDAO.delApprovalComment(param);
    }
}
