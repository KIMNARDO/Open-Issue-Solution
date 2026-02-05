package com.papsnet.openissue.common.service;

import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.BPolicyAuth;
import com.papsnet.openissue.common.dto.DObject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BPolicyAuthService {

    private final CommonDAO commonDAO;

    // C# SelBPolicyAuths -> Java
    public List<BPolicyAuth> selBPolicyAuths(@Nullable BPolicyAuth param) {
        if (param == null) param = new BPolicyAuth();
        return commonDAO.selBPolicyAuth(param);
    }

    // Overload helper to extract userOid from HttpSession (Context["UserOID"]) if available
    private Integer getUserOid(HttpSession session) {
        if (session == null) return null;
        Object val = session.getAttribute("UserOID");
        if (val instanceof Integer i) return i;
        if (val instanceof String s) {
            try { return Integer.valueOf(s); } catch (NumberFormatException ignored) {}
        }
        return null;
    }

    // C# MainAuth(Context, dobj, roles)
    public List<BPolicyAuth> mainAuth(int context, DObject dobj, @Nullable List<BPolicyAuth> roles) {
        Integer userOid = context;
        return mainAuth(userOid, dobj, roles);
    }

    // Java-friendly version taking userOid directly
    public List<BPolicyAuth> mainAuth(@Nullable Integer userOid, DObject dobj, @Nullable List<BPolicyAuth> roles) {
        if (dobj == null || dobj.getBpolicyOID() == null || dobj.getType() == null) return Collections.emptyList();
        List<BPolicyAuth> mainAuth = new ArrayList<>();
        mainAuth.addAll(ownerAuth(userOid, dobj));
        mainAuth.addAll(publicAuth(dobj));
        mainAuth.addAll(adminAuth(dobj));
        if (roles != null && !roles.isEmpty()) mainAuth.addAll(roles);
        return mainAuth;
    }

    // C# OwnerAuth(Context, dobj)
    public List<BPolicyAuth> ownerAuth(HttpSession context, DObject dobj) {
        return ownerAuth(getUserOid(context), dobj);
    }

    public List<BPolicyAuth> ownerAuth(@Nullable Integer userOid, DObject dobj) {
        if (dobj == null || !Objects.equals(dobj.getCreateUs(), userOid)) return Collections.emptyList();
        if (dobj.getBpolicyOID() == null || dobj.getType() == null) return Collections.emptyList();
        return selBPolicyAuths(new BPolicyAuth(dobj.getType(), dobj.getBpolicyOID(), CommonConstant.AUTH_DIV_OWNER, CommonConstant.AUTH_SYSTEM));
    }

    // C# PublicAuth(Context, dobj)
    public List<BPolicyAuth> publicAuth(DObject dobj) {
        if (dobj == null || dobj.getBpolicyOID() == null || dobj.getType() == null) return Collections.emptyList();
        return selBPolicyAuths(new BPolicyAuth(dobj.getType(), dobj.getBpolicyOID(), CommonConstant.AUTH_DIV_PUBLIC, CommonConstant.AUTH_SYSTEM));
    }

    // C# AdminAuth(Context, dobj)
    public List<BPolicyAuth> adminAuth(DObject dobj) {
        if (dobj == null || dobj.getBpolicyOID() == null || dobj.getType() == null) return Collections.emptyList();
        return selBPolicyAuths(new BPolicyAuth(dobj.getType(), dobj.getBpolicyOID(), CommonConstant.AUTH_DIV_MANAGER, CommonConstant.AUTH_SYSTEM));
    }

    // Overloads using pre-fetched auth list (_AuthList)
    public List<BPolicyAuth> mainAuth(int context, DObject dobj, @Nullable List<BPolicyAuth> roles, List<BPolicyAuth> allAuth) {
        Integer userOid = context;
        return mainAuth(userOid, dobj, roles, allAuth);
    }

    public List<BPolicyAuth> mainAuth(@Nullable Integer userOid, DObject dobj, @Nullable List<BPolicyAuth> roles, List<BPolicyAuth> allAuth) {
        if (dobj == null || dobj.getBpolicyOID() == null || dobj.getType() == null || allAuth == null) return Collections.emptyList();
        List<BPolicyAuth> mainAuth = new ArrayList<>();
        mainAuth.addAll(ownerAuth(userOid, dobj, allAuth));
        mainAuth.addAll(publicAuth(dobj, allAuth));
        mainAuth.addAll(adminAuth(dobj, allAuth));
        if (roles != null && !roles.isEmpty()) mainAuth.addAll(roles);
        return mainAuth;
    }

    public List<BPolicyAuth> ownerAuth(@Nullable Integer userOid, DObject dobj, List<BPolicyAuth> allAuth) {
        if (dobj == null || allAuth == null || !Objects.equals(dobj.getCreateUs(), userOid)) return Collections.emptyList();
        Integer policyOID = dobj.getBpolicyOID();
        if (policyOID == null) return Collections.emptyList();
        return allAuth.stream()
                .filter(x -> Objects.equals(x.getPolicyOID(), policyOID))
                .filter(x -> Objects.equals(x.getAuthTargetDiv(), CommonConstant.AUTH_DIV_OWNER))
                .filter(x -> Objects.equals(x.getAuthDiv(), CommonConstant.AUTH_SYSTEM))
                .collect(Collectors.toList());
    }

    public List<BPolicyAuth> publicAuth(DObject dobj, List<BPolicyAuth> allAuth) {
        if (dobj == null || allAuth == null) return Collections.emptyList();
        Integer policyOID = dobj.getBpolicyOID();
        if (policyOID == null) return Collections.emptyList();
        return allAuth.stream()
                .filter(x -> Objects.equals(x.getPolicyOID(), policyOID))
                .filter(x -> Objects.equals(x.getAuthTargetDiv(), CommonConstant.AUTH_DIV_PUBLIC))
                .filter(x -> Objects.equals(x.getAuthDiv(), CommonConstant.AUTH_SYSTEM))
                .collect(Collectors.toList());
    }

    public List<BPolicyAuth> adminAuth(DObject dobj, List<BPolicyAuth> allAuth) {
        if (dobj == null || allAuth == null) return Collections.emptyList();
        Integer policyOID = dobj.getBpolicyOID();
        if (policyOID == null) return Collections.emptyList();
        return allAuth.stream()
                .filter(x -> Objects.equals(x.getPolicyOID(), policyOID))
                .filter(x -> Objects.equals(x.getAuthTargetDiv(), CommonConstant.AUTH_DIV_MANAGER))
                .filter(x -> Objects.equals(x.getAuthDiv(), CommonConstant.AUTH_SYSTEM))
                .collect(Collectors.toList());
    }
}
