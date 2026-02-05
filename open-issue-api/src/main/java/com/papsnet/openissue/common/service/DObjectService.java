package com.papsnet.openissue.common.service;

import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.BPolicy;
import com.papsnet.openissue.common.dto.DObject;
import com.papsnet.openissue.common.dto.BPolicyAuth;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class DObjectService {

    private final CommonDAO commonDAO;
    private final BPolicyService bpolicyService;
    private final BPolicyAuthService bPolicyAuthService;

    public String selTdmxOID(DObject _param) {
        return commonDAO.selTdmxOID(_param);
    }

    public Integer insDObject(DObject _param) {
        Integer result = -1;
        if(_param.getCreateUs() == null || _param.getCreateUs() < 1)
        {
            _param.setCreateUs(null);
            //= Convert.ToInt32(Context["UserOID"]);
        }
        if (_param.getBpolicyOID() == null)
        {
            // Original C# logic used First(): BPolicyRepository.SelBPolicy(new BPolicy { Type = _param.Type }).First().OID
            // To mirror that intent safely, fetch the list and take the first if present.
            List<BPolicy> policies = bpolicyService.selBPolicys(new BPolicy(_param.getType(), null));
            if (policies == null || policies.isEmpty()) {
                log.error("No BPolicy found for type: {} when setting BpolicyOID for DObject", _param.getType());
                throw new IllegalStateException("BPolicy not found for type: " + _param.getType());
            }
            _param.setBpolicyOID(policies.get(0).getOid());
        }
        if (_param.getRevision() == null)
        {
            BPolicy tmpBPolicy = bpolicyService.selBPolicy(new BPolicy (null, _param.getBpolicyOID()));
            if (tmpBPolicy.getIsRevision() != null && tmpBPolicy.getIsRevision().equals("Y"))
            {
                _param.setTdmxOID(selTdmxOID(new DObject(null, _param.getType())));
                //= DObjectRepository.SelTdmxOID(Context, new DObject { Type = _param.Type });
                _param.setRevision(CommonConstant.REVISION_PREFIX + CommonConstant.INIT_REVISION);
            }
        }
        _param.setIsLatest(1);
        _param.setIsReleasedLatest(0);
        result = commonDAO.insDObject(_param);//DaoFactory.SetInsert("Comm.InsDObject", _param);
        return _param.getOid();
    }

    /**
     * Update DObject (mirror of legacy UdtDObject):
     * - set modifyUs if provided (not null and > 0)
     * - update only when OID is valid
     */
    public Integer udtDObject(DObject _param, Integer modifyUs) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        if (modifyUs != null && modifyUs > 0) {
            _param.setModifyUs(modifyUs);
        }
        return commonDAO.udtDObject(_param);
    }

    /** Convenience overload when caller already set modifyUs on param */
    public Integer udtDObject(DObject _param) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        return commonDAO.udtDObject(_param);
    }

    /**
     * Update CreateUs of DObject (mirror of legacy UdtCreateUsDObject)
     * - set modifyUs if provided (actor of the change)
     * - requires valid OID on the target DObject and the desired createUs set in param
     */
    public Integer udtCreateUsDObject(DObject _param, Integer modifyUs) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        if (modifyUs != null && modifyUs > 0) {
            _param.setModifyUs(modifyUs);
        }
        return commonDAO.udtCreateUsDObject(_param);
    }

    /** Convenience overload when caller already set modifyUs on param */
    public Integer udtCreateUsDObject(DObject _param) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        return commonDAO.udtCreateUsDObject(_param);
    }

    /**
     * Delete DObject (mirror of legacy DelDObject)
     * - set deleteUs if provided
     * - delete only when OID is valid
     */
    public Integer delDObject(DObject _param, Integer deleteUs) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        if (deleteUs != null && deleteUs > 0) {
            _param.setDeleteUs(deleteUs);
        }
        return commonDAO.delDObject(_param);
    }

    /** Convenience overload when caller already set deleteUs on param */
    public Integer delDObject(DObject _param) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        return commonDAO.delDObject(_param);
    }

    /**
     * Delete Thumbnail of DObject (mirror of legacy DelThumbnailDObject)
     * - set modifyUs if provided
     * - requires valid OID
     */
    public Integer delThumbnailDObject(DObject _param, Integer modifyUs) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        if (modifyUs != null && modifyUs > 0) {
            _param.setModifyUs(modifyUs);
        }
        return commonDAO.delThumbnailDObject(_param);
    }

    /** Convenience overload for thumbnail delete */
    public Integer delThumbnailDObject(DObject _param) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        return commonDAO.delThumbnailDObject(_param);
    }

    // ---------- Additional legacy-compatible helpers ----------

    public Integer selNameSeq(DObject _param) {
        return commonDAO.selNameSeq(_param);
    }

    public Integer udtLatestDObject(DObject _param, Integer modifyUs) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        if (modifyUs != null && modifyUs > 0) _param.setModifyUs(modifyUs);
        return commonDAO.udtLatestDObject(_param);
    }
    public Integer udtLatestDObject(DObject _param) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        return commonDAO.udtLatestDObject(_param);
    }

    public Integer udtReleaseLatestDObject(DObject _param, Integer modifyUs) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        if (modifyUs != null && modifyUs > 0) _param.setModifyUs(modifyUs);
        return commonDAO.udtReleaseLatestDObject(_param);
    }
    public Integer udtReleaseLatestDObject(DObject _param) {
        if (_param == null || _param.getOid() == null || _param.getOid() <= 0) return -1;
        return commonDAO.udtReleaseLatestDObject(_param);
    }

    /** Alias of insDObject to mirror legacy InsDObjectUs */
    public Integer insDObjectUs(DObject _param) { return insDObject(_param); }

    /** Select one with enrichment (BPolicy & BPolicyAuths) */
    public DObject selDObject(DObject _param, Integer reqUserUid) {
        DObject d = commonDAO.selDObject(_param);
        if (d != null) {
            try {
                // Set BPolicy
                BPolicy pol = bpolicyService.selBPolicy(new BPolicy(d.getType(), d.getBpolicyOID()));
                d.setBpolicy(pol);
            } catch (Exception e) {
                log.warn("Failed to load BPolicy for DObject oid={}, type={}, policyOID={}", d.getOid(), d.getType(), d.getBpolicyOID(), e);
            }
            try {
                // Set BPolicyAuths (public/admin/owner if resolvable)
                List<BPolicyAuth> auths = bPolicyAuthService.mainAuth(reqUserUid, d, null);
                d.setBpolicyAuths(auths);
            } catch (Exception e) {
                log.warn("Failed to compute BPolicyAuths for DObject oid={}", d.getOid(), e);
            }
        }
        return d;
    }

    /** List with enrichment */
    public List<DObject> selDObjects(DObject _param, Integer reqUserUid) {
        List<DObject> list = commonDAO.selDObjects(_param);
        if (list == null || list.isEmpty()) return List.of();
        for (DObject d : list) {
            try {
                BPolicy pol = bpolicyService.selBPolicy(new BPolicy(d.getType(), d.getBpolicyOID()));
                d.setBpolicy(pol);
            } catch (Exception e) {
                log.warn("Failed to load BPolicy for DObject oid={}", d.getOid(), e);
            }
            try {
                List<BPolicyAuth> auths = bPolicyAuthService.mainAuth(reqUserUid, d, null);
                d.setBpolicyAuths(auths);
            } catch (Exception e) {
                log.warn("Failed to compute BPolicyAuths for DObject oid={}", d.getOid(), e);
            }
        }
        return list;
    }

    /** List with enrichment (optimized variant) */
    public List<DObject> selDObjectOIDs(DObject _param, Integer reqUserUid) {
        List<DObject> list = commonDAO.selDObjects(_param);
        if (list == null || list.isEmpty()) return List.of();
        // Enrich each item; use per-item policy lookup
        for (DObject d : list) {
            try {
                BPolicy pol = bpolicyService.selBPolicy(new BPolicy(d.getType(), d.getBpolicyOID()));
                d.setBpolicy(pol);
            } catch (Exception e) {
                log.warn("Failed to load BPolicy for DObject oid={}", d.getOid(), e);
            }
            try {
                List<BPolicyAuth> auths = bPolicyAuthService.mainAuth(reqUserUid, d, null);
                d.setBpolicyAuths(auths);
            } catch (Exception e) {
                log.warn("Failed to compute BPolicyAuths for DObject oid={}", d.getOid(), e);
            }
        }
        return list;
    }

    /** Overload using pre-fetched auths list (if provided), otherwise fallback */
    public List<DObject> selDObjectOIDs(DObject _param, List<?> ignoredAuths, Integer reqUserUid) {
        // Attempt to prefetch all auths to mirror legacy optimization
        List<BPolicyAuth> allAuths;
        try {
            allAuths = bPolicyAuthService.selBPolicyAuths(null);
        } catch (Exception ex) {
            allAuths = null;
        }
        List<DObject> list = commonDAO.selDObjects(_param);
        if (list == null || list.isEmpty()) return List.of();
        for (DObject d : list) {
            try {
                BPolicy pol = bpolicyService.selBPolicy(new BPolicy(d.getType(), d.getBpolicyOID()));
                d.setBpolicy(pol);
            } catch (Exception e) {
                log.warn("Failed to load BPolicy for DObject oid={}", d.getOid(), e);
            }
            try {
                List<BPolicyAuth> auths = (allAuths == null)
                        ? bPolicyAuthService.mainAuth(reqUserUid, d, null)
                        : bPolicyAuthService.mainAuth(reqUserUid, d, null, allAuths);
                d.setBpolicyAuths(auths);
            } catch (Exception e) {
                log.warn("Failed to compute BPolicyAuths for DObject oid={}", d.getOid(), e);
            }
        }
        return list;
    }

    public Integer copyDObject(DObject _param, Integer reqUserUid) {
        if (_param == null || _param.getOid() == null) return -1;
        DObject target = selDObject(DObject.builder().oid(_param.getOid()).build(), reqUserUid);
        if (target == null) return -1;
        target.setBpolicyOID(null);
        target.setRevision(null);
        if (_param.getName() != null) target.setName(_param.getName());
        return insDObject(target);
    }

    public Integer reviseDObject(DObject _param, Integer reqUserUid) {
        if (_param == null || _param.getOid() == null) return -1;
        DObject target = selDObject(DObject.builder().oid(_param.getOid()).build(), reqUserUid);
        if (target == null) return -1;
        udtLatestDObject(DObject.builder().oid(_param.getOid()).isLatest(0).build());
        target.setBpolicyOID(null);
        target.setRevision(makeMajorRevisionUp(target.getRevision()));
        if (_param.getCreateUs() != null) target.setCreateUs(_param.getCreateUs());
        if (_param.getName() != null) target.setName(_param.getName());
        return insDObject(target);
    }

    public Integer cloneDObject(DObject _param, Integer reqUserUid) {
        if (_param == null || _param.getOid() == null) return -1;
        DObject target = selDObject(DObject.builder().oid(_param.getOid()).build(), reqUserUid);
        if (target == null) return -1;
        return insDObject(target);
    }

    private String makeMajorRevisionUp(String revision) {
        if (revision == null || revision.isEmpty()) {
            return CommonConstant.REVISION_PREFIX + CommonConstant.INIT_REVISION;
        }
        int i = revision.length() - 1;
        while (i >= 0 && Character.isDigit(revision.charAt(i))) i--;
        String head = revision.substring(0, i + 1);
        String tail = revision.substring(i + 1);
        if (tail.isEmpty()) return revision + "1";
        try {
            int num = Integer.parseInt(tail);
            String fmt = String.format("%0" + tail.length() + "d", num + 1);
            return head + fmt;
        } catch (NumberFormatException e) {
            return revision + "1";
        }
    }
}
