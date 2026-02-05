package com.papsnet.openissue.biz.project.service;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.biz.openIssue.dao.OpenIssueDAO;
import com.papsnet.openissue.biz.openIssue.dto.OpenIssueRelationship;
import com.papsnet.openissue.biz.project.dao.PmsDAO;
import com.papsnet.openissue.biz.project.dto.PmsRelationship;
import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.constant.PmsConstant;
import com.papsnet.openissue.common.dto.BPolicyAuth;
import com.papsnet.openissue.common.dto.DObject;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.BDefine;
import com.papsnet.openissue.common.service.BPolicyAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

/**
 * Java version of C# PmsAuth.RoleAuth minimal mapping.
 * Note: This is a minimal skeleton based on available project types.
 * It assumes existence of BPolicyAuthService for policy auth lookup and PmsDAO for relationship.
 */
@Service
@RequiredArgsConstructor
public class PmsAuthService {

    private final BPolicyAuthService bPolicyAuthService;
    private final OpenIssueDAO openIssueDAO;

    public List<BPolicyAuth> roleAuthOpenIssueGroup(int reqUserUid, DObject dobj)
    {
        OpenIssueRelationship memberRelParam = new OpenIssueRelationship();
        memberRelParam.setType(PmsConstant.RELATIONSHIP_MEMBER);
        memberRelParam.setFromOID(dobj.getOid());
        memberRelParam.setToOID(reqUserUid);
        List<OpenIssueRelationship> members = openIssueDAO.selectRelationshipByCondition(memberRelParam);

        List<BPolicyAuth> result = new ArrayList<>();
        if (!members.isEmpty())
        {
            BPolicyAuth param = new BPolicyAuth();
            param.setType(dobj.getType());
            param.setPolicyOID(dobj.getBpolicyOID());
            param.setAuthTargetDiv(CommonConstant.TYPE_ROLE);
            param.setAuthTargetOID(Objects.requireNonNull(members.stream().findFirst().orElse(null)).getRootOid());
            param.setAuthDiv(CommonConstant.AUTH_SYSTEM);
            result = bPolicyAuthService.selBPolicyAuths(param);
            return result;
        }
        return result;
    }
    public List<BPolicyAuth> roleAuthOpenIssueGroup(DObject dobj, List<OpenIssueRelationship> members, List<BPolicyAuth> allAuth, Integer userOid) {
        if (dobj == null || dobj.getBpolicyOID() == null || allAuth == null || members == null || userOid == null) {
            return Collections.emptyList();
        }
        OpenIssueRelationship rel = members.stream()
                .filter(m -> Objects.equals(m.getType(), PmsConstant.RELATIONSHIP_MEMBER))
                .filter(m -> Objects.equals(m.getFromOID(), dobj.getOid()))
                .filter(m -> Objects.equals(m.getToOID(), userOid))
                .findFirst()
                .orElse(null);
        if (rel == null || rel.getRoleOid() == null) return Collections.emptyList();
        Integer roleOID = rel.getRoleOid();
        return allAuth.stream()
                .filter(a -> Objects.equals(a.getType(), dobj.getType()))
                .filter(a -> Objects.equals(a.getPolicyOID(), dobj.getBpolicyOID()))
                .filter(a -> Objects.equals(a.getAuthTargetDiv(), CommonConstant.TYPE_ROLE))
                .filter(a -> Objects.equals(a.getAuthTargetOID(), roleOID))
                .filter(a -> Objects.equals(a.getAuthDiv(), CommonConstant.AUTH_SYSTEM))
                .toList();
    }

    /**
     * Filter-based role auth calculation without DAO dependence.
     * Provide pre-fetched members and allAuth list.
     */
    public List<BPolicyAuth> roleAuth(DObject dobj, List<PmsRelationship> members, List<BPolicyAuth> allAuth, Integer userOid) {
        if (dobj == null || dobj.getBpolicyOID() == null || allAuth == null || members == null || userOid == null) {
            return Collections.emptyList();
        }
        PmsRelationship rel = members.stream()
                .filter(m -> Objects.equals(m.getType(), PmsConstant.RELATIONSHIP_MEMBER))
                .filter(m -> Objects.equals(m.getFromOID(), dobj.getOid()))
                .filter(m -> Objects.equals(m.getToOID(), userOid))
                .findFirst()
                .orElse(null);
        if (rel == null || rel.getRoleOID() == null) return Collections.emptyList();
        Integer roleOID = rel.getRoleOID();
        return allAuth.stream()
                .filter(a -> Objects.equals(a.getType(), dobj.getType()))
                .filter(a -> Objects.equals(a.getPolicyOID(), dobj.getBpolicyOID()))
                .filter(a -> Objects.equals(a.getAuthTargetDiv(), CommonConstant.TYPE_ROLE))
                .filter(a -> Objects.equals(a.getAuthTargetOID(), roleOID))
                .filter(a -> Objects.equals(a.getAuthDiv(), CommonConstant.AUTH_SYSTEM))
                .toList();
    }

    public List<BPolicyAuth> roleAuth(DObject dobj, List<PmsRelationship> members, List<BPolicyAuth> allAuth, Integer userOid, Person person, Integer hiddenGuestRoleOid) {
        if (person != null && Objects.equals(person.getHiddenGuest(), CommonConstant.PERSON_ACTION_HIDDEN_GUEST)) {
            if (hiddenGuestRoleOid == null) return Collections.emptyList();
            if (dobj == null || dobj.getBpolicyOID() == null || allAuth == null) return Collections.emptyList();
            return allAuth.stream()
                    .filter(a -> Objects.equals(a.getType(), dobj.getType()))
                    .filter(a -> Objects.equals(a.getPolicyOID(), dobj.getBpolicyOID()))
                    .filter(a -> Objects.equals(a.getAuthTargetDiv(), CommonConstant.TYPE_ROLE))
                    .filter(a -> Objects.equals(a.getAuthTargetOID(), hiddenGuestRoleOid))
                    .filter(a -> Objects.equals(a.getAuthDiv(), CommonConstant.AUTH_SYSTEM))
                    .toList();
        }
        return roleAuth(dobj, members, allAuth, userOid);
    }
}
