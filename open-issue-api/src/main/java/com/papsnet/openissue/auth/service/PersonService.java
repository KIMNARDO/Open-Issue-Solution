package com.papsnet.openissue.auth.service;

import com.papsnet.openissue.auth.dao.PersonDAO;
import com.papsnet.openissue.auth.dao.UserDAO;
import com.papsnet.openissue.auth.dto.Group;
import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.dto.Verify;
import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.BPolicy;
import com.papsnet.openissue.common.dto.DObject;
import com.papsnet.openissue.common.dto.DRelationship;
import com.papsnet.openissue.common.dto.OrganizationTreeDTO;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.service.DObjectService;
import com.papsnet.openissue.common.service.DLibraryService;
import com.papsnet.openissue.common.dto.DLibrary;
import com.papsnet.openissue.util.EDecode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Comparator;

import java.security.DigestException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PersonService {
    private final PersonDAO personDAO;
    private final CommonDAO commonDAO;
    private final DObjectService dObjectService;
    private final DLibraryService dLibraryService;

    // ===== Legacy-compatible methods (ported from C# repository) =====
    public Person loginSelPerson(Person param) {
        if (param == null) return null;
        param.setType(CommonConstant.TYPE_PERSON);
        List<Person> list = personDAO.selPerson(param);
        if (list == null || list.isEmpty()) return null;
        Person person = list.get(0);
        if (person.getDeleteDt() != null) return null;
        return person;
    }

    public Person selPerson(Person param) {
        if (param == null) return null;
        param.setType(CommonConstant.TYPE_PERSON);
        List<Person> list = personDAO.selPerson(param);
        if (list == null || list.isEmpty()) return null;
        Person person = list.get(0);
        if (person == null) return null;
        // Mask password
        person.setPassword("**************");
        // Department name from DObject when missing
        if ((person.getDepartmentNm() == null || person.getDepartmentNm().isEmpty()) && person.getDepartmentOID() != null) {
            DObject dept = commonDAO.selDObject(new DObject(person.getDepartmentOID(), CommonConstant.TYPE_DEPARTMENT));
            person.setDepartmentNm(dept == null ? "" : dept.getName());
        }
        // Append (삭제) when soft-deleted
        if (person.getDeleteDt() != null && person.getName() != null && !person.getName().contains("(삭제)")) {
            person.setName(person.getName() + "(삭제)");
        }
        Verify verify = personDAO.selVerifyByFromId(param.getOid());
        if (verify != null) {
            person.setCheck2FA(verify.getCheck2FA());
        }

        // Resolve names from DLibrary for job title, position, nation, job group
//        try {
//            if (person.getJobTitleOID() != null) {
//                DLibrary lib = new DLibrary();
//                lib.setOid(person.getJobTitleOID());
//                DLibrary found = dLibraryService.SelLibraryObject(lib);
//                if (found != null) {
//                    person.setJobTitleNm(found.getKorNm());
//                    if (person.getJobTitleOrd() == null) person.setJobTitleOrd(found.getOrd());
//                }
//            }
//        } catch (Exception ignore) { }
//        try {
//            if (person.getJobPositionOID() != null) {
//                DLibrary lib = new DLibrary();
//                lib.setOid(person.getJobPositionOID());
//                DLibrary found = dLibraryService.SelLibraryObject(lib);
//                if (found != null) {
//                    person.setJobPositionNm(found.getKorNm());
//                }
//            }
//        } catch (Exception ignore) { }
//        try {
//            if (person.getNation() != null) {
//                DLibrary lib = new DLibrary();
//                lib.setOid(person.getNation());
//                DLibrary found = dLibraryService.SelLibraryObject(lib);
//                if (found != null) {
//                    person.setNationNm(found.getKorNm());
//                }
//            }
//        } catch (Exception ignore) { }
//        try {
//            if (person.getJobGroupOID() != null) {
//                DLibrary lib = new DLibrary();
//                lib.setOid(person.getJobGroupOID());
//                DLibrary found = dLibraryService.SelLibraryObject(lib);
//                if (found != null) {
//                    person.setJobGroupNm(found.getKorNm());
//                }
//            }
//        } catch (Exception ignore) { }
        return person;
    }

    public List<Person> selPersons(Person param) {
        if (param == null) return null;
        // 1) Load base people
        param.setType(CommonConstant.TYPE_PERSON);
        List<Person> list = personDAO.selPerson(param);
        if (list == null || list.isEmpty()) return list;

        // 2) Preload reference data (departments, libraries, code libraries)
        List<DObject> selDepartments;
        List<DLibrary> selLibraries;
        List<DLibrary> selCodeLibraries;
        try {
            selDepartments = commonDAO.selDObjects(new DObject(null, CommonConstant.TYPE_DEPARTMENT));
        } catch (Exception e) {
            selDepartments = new ArrayList<>();
        }
        try {
            selLibraries = dLibraryService.SelLibrary(new DLibrary());
        } catch (Exception e) {
            selLibraries = new ArrayList<>();
        }
        try {
            selCodeLibraries = dLibraryService.SelCodeLibrary(new DLibrary());
        } catch (Exception e) {
            selCodeLibraries = new ArrayList<>();
        }

        // Build quick lookup maps
        Map<Integer, DObject> deptMap = new HashMap<>();
        for (DObject d : selDepartments) {
            if (d.getOid() != null) deptMap.put(d.getOid(), d);
        }
        Map<Integer, DLibrary> libMap = new HashMap<>();
        for (DLibrary l : selLibraries) {
            if (l.getOid() != null) libMap.put(l.getOid(), l);
        }
        Map<Integer, DLibrary> codeLibMap = new HashMap<>();
        for (DLibrary l : selCodeLibraries) {
            if (l.getOid() != null) codeLibMap.put(l.getOid(), l);
        }

        // 3) Collect BPolicy OIDs for bulk fetch
        List<Integer> bpolOids = new ArrayList<>();
        for (Person p : list) {
            if (p.getBpolicyOID() != null) bpolOids.add(p.getBpolicyOID());
        }
        Map<Integer, BPolicy> bpolicyMap = new HashMap<>();
        if (!bpolOids.isEmpty()) {
            try {
                List<BPolicy> bpolicies = commonDAO.selBPolicys(new BPolicy(CommonConstant.TYPE_PERSON, null, bpolOids));
                for (BPolicy bp : bpolicies) {
                    if (bp.getOid() != null) bpolicyMap.put(bp.getOid(), bp);
                }
            } catch (Exception ignore) { }
        }

        // 4) Enrich each person
        for (Person p : list) {
            // mask password
            p.setPassword("**************");

            // department name
            if (p.getDepartmentOID() != null) {
                DObject dep = deptMap.get(p.getDepartmentOID());
                p.setDepartmentNm(dep != null ? dep.getName() : "");
            } else {
                p.setDepartmentNm("");
            }

            // deleted mark
            if (p.getDeleteDt() != null && p.getName() != null && !p.getName().contains("(삭제)")) {
//                p.setName(p.getName() + "(삭제)");
            }

            // job title
            if (p.getJobTitleOID() != null) {
                DLibrary lib = libMap.get(p.getJobTitleOID());
                if (lib != null) {
                    p.setJobTitleNm(lib.getKorNm());
                    if (p.getJobTitleOrd() == null) p.setJobTitleOrd(lib.getOrd());
                }
            }
            // job position
            if (p.getJobPositionOID() != null) {
                DLibrary lib = libMap.get(p.getJobPositionOID());
                if (lib != null) p.setJobPositionNm(lib.getKorNm());
            }
            // item (제품군)
            if (p.getItemOID() != null && p.getItemOID() > 0) {
                DLibrary lib = codeLibMap.get(p.getItemOID());
                if (lib != null) p.setItemNm(lib.getKorNm());
            }
            // job group
            if (p.getJobGroupOID() != null) {
                DLibrary lib = libMap.get(p.getJobGroupOID());
                if (lib != null) p.setJobGroupNm(lib.getKorNm());
            }

            // bpolicy
            if (p.getBpolicyOID() != null) {
                BPolicy bp = bpolicyMap.get(p.getBpolicyOID());
                if (bp != null) {
                    p.setBpolicy(bp);
                }
            }
        }

        return list;
    }

    public List<Person> selAllPersons(Person param) {
        // For now, same as selPersons. If business rules differ, adjust filters here.
        return selPersons(param);
    }


    public int udtIpPwPerson(Person param) {
        return personDAO.udtIpPwPerson(param);
    }

    public int udtPersonLastLogin(Person param) {
        return personDAO.udtPersonLastLogin(param);
    }

    // ===== Existing methods =====
//    public List<Person> PersonList(Person person) {
//        // Delegate to selPersons to provide a single, enriched source of truth
//        return selPersons(person);
//    }

    public Person selPersonByOid(int oid) {
        Person result = personDAO.selPersonById(oid);
        if (result == null) {
            return null;
        }
        // Resolve BPolicy as before
        List<BPolicy> bPolicies = commonDAO.selBPolicys(new BPolicy(result.getType(), result.getBpolicyOID()));
        if (bPolicies != null && !bPolicies.isEmpty()) {
            result.setBpolicy(bPolicies.get(0));
            result.setBpolicyNm(bPolicies.get(0).getName());
        }

        // Enrich fields similarly to legacy C# selPersionByOid
        try {
            // Department name
            if (result.getDepartmentOID() != null) {
                DObject selDepartment = commonDAO.selDObject(new DObject(result.getDepartmentOID(), CommonConstant.TYPE_DEPARTMENT));
                result.setDepartmentNm(selDepartment != null ? selDepartment.getName() : "");
            } else {
                result.setDepartmentNm("");
            }
        } catch (Exception ignore) { result.setDepartmentNm(""); }

        // Append (삭제) mark if soft-deleted
        if (result.getDeleteDt() != null && result.getName() != null && !result.getName().contains("(삭제)")) {
//            result.setName(result.getName() + "(삭제)");
        }

        // Job title name (and order if available)
        try {
            if (result.getJobTitleOID() != null) {
                DLibrary lib = new DLibrary();
                lib.setOid(result.getJobTitleOID());
                DLibrary found = dLibraryService.SelLibraryObject(lib);
                if (found != null) {
                    result.setJobTitleNm(found.getKorNm());
                    if (result.getJobTitleOrd() == null) result.setJobTitleOrd(found.getOrd());
                }
            }
        } catch (Exception ignore) { }

        // Job position name
        try {
            if (result.getJobPositionOID() != null) {
                DLibrary lib = new DLibrary();
                lib.setOid(result.getJobPositionOID());
                DLibrary found = dLibraryService.SelLibraryObject(lib);
                if (found != null) {
                    result.setJobPositionNm(found.getKorNm());
                }
            }
        } catch (Exception ignore) { }

        // Nation name
        try {
            if (result.getNation() != null) {
                DLibrary lib = new DLibrary();
                lib.setOid(result.getNation());
                DLibrary found = dLibraryService.SelLibraryObject(lib);
                if (found != null) {
                    result.setNationNm(found.getKorNm());
                }
            }
        } catch (Exception ignore) { }

        // Item (제품군) name from CodeLibrary
        try {
            if (result.getItemOID() != null && result.getItemOID() > 0) {
                DLibrary lib = new DLibrary();
                lib.setOid(result.getItemOID());
                // SelCodeLibrary returns a list; pick the first if present
                List<DLibrary> codeList = dLibraryService.SelCodeLibrary(lib);
                if (codeList != null && !codeList.isEmpty()) {
                    result.setItemNm(codeList.get(0).getKorNm());
                }
            }
        } catch (Exception ignore) { }

        // Job group name
        try {
            if (result.getJobGroupOID() != null) {
                DLibrary lib = new DLibrary();
                lib.setOid(result.getJobGroupOID());
                DLibrary found = dLibraryService.SelLibraryObject(lib);
                if (found != null) {
                    result.setJobGroupNm(found.getKorNm());
                }
            }
        } catch (Exception ignore) { }

        // Mask password for safety when returning a single person as well
        result.setPassword("**************");

        return result;
    }

    public Person selPersonByAccountId(String accountId) throws Exception {
        Person result = personDAO.findPersonByid(accountId).orElseThrow();
        if (result == null) {
            return null;
        }

        BPolicy bPolicy = commonDAO.selBPolicy(new BPolicy(result.getType(), result.getBpolicyOID()));
        result.setBpolicy(bPolicy);
        result.setBpolicyNm(bPolicy.getName());

        return result;
    }

    public Integer updateLastLoginDt(Person user) {
        Date now = new Date();
        user.setLastLogin(now);

        return personDAO.udtPerson(user);
    }

    public List<Person> selGroupMembers(Long grpUid) {
        return personDAO.selectGroupMembers(grpUid);
    }


    private void setDepartmentPeople(OrganizationTreeDTO treeDTO ,Integer departmentOID) {
        Person param = new Person();
        param.setType(CommonConstant.TYPE_PERSON);
        param.setDepartmentOID(departmentOID);
        treeDTO.setPeople(personDAO.selPerson(param));
    }

    private List<DObject> findDepartment(Integer gwDeptId) {
        DRelationship relParam = new DRelationship();
        relParam.setType(CommonConstant.TYPE_DEPARTMENT);
        relParam.setFromOID(gwDeptId);
        List<Integer> gwDeptIds = commonDAO.selRelationships(relParam).stream().map(DRelationship::getToOID).toList();
        if(gwDeptIds == null || gwDeptIds.size() < 1) return null;

        DObject objParam = new DObject();
        objParam.setType(CommonConstant.TYPE_DEPARTMENT);
        objParam.setGwDeptIds(gwDeptIds);
        return commonDAO.selDObjects(objParam);
    }

    private void setChildrenRecursively(OrganizationTreeDTO treeDTO, Integer gwDeptId) {
        List<DObject> departments = findDepartment(gwDeptId);
        if(departments == null || departments.size() < 1) return;
        List<OrganizationTreeDTO> children = new ArrayList<>();
        departments.forEach(dep -> {
            OrganizationTreeDTO input = new OrganizationTreeDTO();
            input.setKey(dep.getOid().toString());
            input.setTitle(dep.getName());

            setDepartmentPeople(input, dep.getOid());

//            recursive
            setChildrenRecursively(input, dep.getGwDeptId());

            children.add(input);
        });

        treeDTO.setChildren(children);

    }

    @Transactional
    public Integer insPerson(Integer reqUserUid, Person _param) throws Exception {
        // Create DObject
        DObject dobj = new DObject();
        dobj.setType(CommonConstant.TYPE_PERSON);
        dobj.setName(_param.name);
        dobj.setCreateUs(reqUserUid);
        Integer newOid = dObjectService.insDObject(dobj);

        // Check duplicate ID
        List<Person> dup = this.selPersons(new Person(null, null, _param.getId()));
        if (dup != null && !dup.isEmpty()) {
            // mimic legacy: return -1 on duplicate
            return -1;
        }

        // Set OID and encrypt password
        _param.setOid(newOid);
        if (_param.getPassword() != null && !_param.getPassword().isEmpty()) {
            try {
                _param.setPassword(EDecode.encrypt(_param.getPassword()));
            } catch (DigestException e) {
                throw new RuntimeException("비밀번호 암호화 실패", e);
            }
        }
        personDAO.insPerson(_param);
        // Note: Verify default insert is skipped (no-op) to keep changes minimal
        // insert Check2FA
        Verify newVerify = new Verify();
        newVerify.setFromOID(_param.getOid());
        newVerify.setCheck2FA(_param.getCheck2FA());
        personDAO.insVerify(newVerify);
        return newOid;
    }

    @Transactional
    public void udtPerson(Integer reqUserUid, Person _param) {
        // Normalize name removing "(삭제)"
        if (_param.getName() != null && _param.getName().contains("(삭제)")) {
            _param.setName(_param.getName().split("\\(")[0]);
        }
        // Update DObject
        DObject dobj = new DObject();
        dobj.setType(CommonConstant.TYPE_PERSON);
        dobj.setName(_param.getName());
        dobj.setOid(_param.getOid());
        dobj.setThumbnail(_param.getThumbnail());
        dobj.setModifyUs(reqUserUid);
        dObjectService.udtDObject(dobj);

        // Update person
        personDAO.udtPerson(_param);

        // Note: Verify update/insert skipped (placeholder)
        // Update Check2FA
        Verify verify = personDAO.selVerifyByFromId(_param.getOid());
        if (verify != null && verify.getOid() > 0) {
            verify.setCheck2FA(_param.getCheck2FA());
            personDAO.uptVerify(verify);
        } else {
            Verify newVerify = new Verify();
            newVerify.setFromOID(_param.getOid());
            newVerify.setCheck2FA(_param.getCheck2FA());
            personDAO.insVerify(newVerify);
        }

    }

    @Transactional
    public void udtPwPerson(Person _param) throws Exception {
        if (_param.getPassword() != null && !_param.getPassword().isEmpty()) {
            _param.setPassword(EDecode.encrypt(_param.getPassword()));
            personDAO.udtIpPwPerson(_param);
            return;
        }
        personDAO.udtPwPerson(_param);
    }

    public List<Person> selPersonsWithDeptLogic(Person _param) {
        List<Person> lPerson;
        if (_param.getDepartmentOID() == null || _param.getDepartmentOID() < 0) {
            lPerson = this.selPersons(_param);
        } else {
            DObject dobj = commonDAO.selDObject(new DObject(_param.getDepartmentOID()));
            if (dobj != null && CommonConstant.TYPE_COMPANY.equals(dobj.getType())) {
                lPerson = this.selPersons(new Person());
            } else {
                lPerson = this.selPersons(_param);
            }
        }
        if (lPerson == null) return null;
        // Order: jobTitleOrd presence desc, then jobTitleOrd asc, then name asc
        lPerson.sort(Comparator
                .comparing((Person p) -> p.getJobTitleOrd() != null).reversed()
                .thenComparing(p -> p.getJobTitleOrd(), Comparator.nullsLast(Integer::compareTo))
                .thenComparing(Person::getName, Comparator.nullsLast(String::compareTo))
        );
        return lPerson;
    }

    @Transactional
    public void delPerson(Integer reqUserUid, Person _param) {
        DObject dobj = new DObject();
        dobj.setType(CommonConstant.TYPE_PERSON);
        dobj.setOid(_param.getOid());
        dObjectService.delDObject(dobj, reqUserUid);
    }

    public OrganizationTreeDTO selPersonWithOrganization() throws Exception {
        OrganizationTreeDTO resultTree = new OrganizationTreeDTO();

        DObject company = commonDAO.selDObject(new DObject(null, CommonConstant.TYPE_COMPANY));
        resultTree.setKey(company.getOid().toString());
        resultTree.setTitle(company.getName());

        setDepartmentPeople(resultTree, company.getOid());
        setChildrenRecursively(resultTree, company.getGwDeptId());


        return resultTree;
    }

}
