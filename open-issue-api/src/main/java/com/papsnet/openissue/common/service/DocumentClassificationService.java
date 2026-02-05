package com.papsnet.openissue.common.service;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.service.PersonService;
import com.papsnet.openissue.common.constant.DocClassConstant;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dao.DocumentClassificationDAO;
import com.papsnet.openissue.common.dto.BPolicy;
import com.papsnet.openissue.common.dto.DocClass;
import com.papsnet.openissue.common.dto.JqTreeModel;
import com.papsnet.openissue.common.exception.CNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DocumentClassificationService {
    private final DocumentClassificationDAO documentClassificationDAO;
    private final DObjectService dObjectService;
    private final CommonDAO commonDAO;
    private final BPolicyService bpolicyService;
    private final PersonService personService;

    @Transactional(readOnly = true)
    public List<DocClass> SelDocClass(DocClass param) throws Exception {
        param.setType(DocClassConstant.TYPE_DOCCLASS);
        List<DocClass> list = documentClassificationDAO.selDocClass(param);
        enrichDocClass(list);
        return list;
    }

    @Transactional(readOnly = true)
    public List<DocClass> AllSelDocClass(DocClass param) throws Exception {
        param.setType(DocClassConstant.TYPE_DOCCLASS);
        List<DocClass> list = documentClassificationDAO.selAllDocClass(param);
        enrichDocClass(list);
        return list;
    }

    @Transactional(readOnly = true)
    public DocClass SelDocClassObject(DocClass param) throws Exception {
        List<DocClass> list = AllSelDocClass(param);
        if (list == null || list.isEmpty()) return null;
        return list.get(0);
    }

    private void enrichDocClass(List<DocClass> list) {
        if (list == null || list.isEmpty()) return;
        Set<Integer> bpolicyOids = new HashSet<>();
        String type = list.get(0).getType();
        for (DocClass dc : list) {
            if (dc.getBpolicyOID() != null) bpolicyOids.add(dc.getBpolicyOID());
            if (dc.getType() == null) dc.setType(DocClassConstant.TYPE_DOCCLASS);
        }
        List<BPolicy> policies = Collections.emptyList();
        try {
            policies = bpolicyService.selBPolicys(new BPolicy(type, null, new ArrayList<>(bpolicyOids)));
        } catch (Exception ignored) { }
        for (DocClass dc : list) {
            if (dc.getBpolicyOID() != null && policies != null && !policies.isEmpty()) {
                for (BPolicy bp : policies) {
                    if (bp.getOid() != null && bp.getOid().equals(dc.getBpolicyOID())) {
                        dc.setBpolicy(bp);
                        break;
                    }
                }
            } else if (dc.getBpolicyOID() != null) {
                try {
                    BPolicy bp = bpolicyService.selBPolicy(new BPolicy(dc.getType(), dc.getBpolicyOID()));
                    dc.setBpolicy(bp);
                } catch (Exception ignored) { }
            }
            if (dc.getCreateUs() != null) {
                try {
                    Person person = personService.selPersonByOid(dc.getCreateUs());
                    if (person != null && person.getName() != null) {
                        dc.setCreateUsNm(person.getName());
                    }
                } catch (Exception ignored) { }
            }
        }
    }

    @Transactional
    public Integer insertDocClass(DocClass param) {
        // Create DObject first with document classification type
        param.setType(DocClassConstant.TYPE_DOCCLASS);
        param.setTableNm(DocClassConstant.TABLE_DOCCLASS);
        Integer oid = dObjectService.insDObject(param);
        param.setOid(oid);
        documentClassificationDAO.insDocClass(param);
        return oid;
    }

    @Transactional
    public int updateDocClass(DocClass param) {
        dObjectService.udtDObject(param);
        return documentClassificationDAO.updateDocClass(param);
    }

    @Transactional
    public int deleteDocClass(DocClass param) {
        return commonDAO.delDObject(param);
    }

    public List<DocClass> selDocClassTree(Integer oid) throws Exception {
        List<DocClass> result = documentClassificationDAO.selectDocClassTree(oid);
        if(result == null || result.isEmpty()) return new ArrayList<>();
        return result;
    }

}
