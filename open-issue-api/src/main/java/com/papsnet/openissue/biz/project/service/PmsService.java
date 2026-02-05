package com.papsnet.openissue.biz.project.service;

import com.papsnet.openissue.auth.dao.PersonDAO;
import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.biz.project.dao.PmsDAO;
import com.papsnet.openissue.biz.project.dto.*;
import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.dto.JqTreeModel;
import com.papsnet.openissue.common.dto.DLibrary;

import java.util.*;

import com.papsnet.openissue.common.dto.BDefine;
import com.papsnet.openissue.common.constant.PmsConstant;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.DObject;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.service.DLibraryService;
import com.papsnet.openissue.common.service.DObjectService;
import com.papsnet.openissue.common.dto.BPolicy;
import com.papsnet.openissue.common.dto.BPolicyAuth;
import com.papsnet.openissue.common.service.BPolicyService;
import com.papsnet.openissue.common.service.BPolicyAuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class PmsService {
    private final PmsDAO pmsDAO;
    private final PersonDAO personDAO;
    private final CommonDAO commonDAO;
    private final DObjectService dObjectService;
    private final BPolicyService bpolicyService;
    private final BPolicyAuthService bPolicyAuthService;
    private final DLibraryService dLibraryService;

    /**
     * WBS 트리 구조 조회 (프로젝트 필터로 단일 프로젝트를 찾아 루트로 구성)
     */
    public PmsRelationship selWbsStructure(PmsProject param) throws Exception {
        // 1) 프로젝트 조회 (필터 조건으로 1건 선택)
        List<PmsProject> projects = pmsDAO.selPmsProject(param);
        if (projects == null || projects.isEmpty()) {
            throw new CBizProcessFailException("프로젝트를 찾을 수 없습니다.");
        }
        PmsProject proj = projects.get(0);

        // 2) 루트 노드 구성
        PmsRelationship root = new PmsRelationship();
        root.setLevel(0);
        root.setToOID(proj.getOid());
        root.setObjName(proj.getName());
        root.setDescription(proj.getDescription());
        root.setObjType(proj.getType());
        root.setEstDuration(proj.getEstDuration());
        root.setEstStartDt(proj.getEstStartDt());
        root.setEstEndDt(proj.getEstEndDt());
        root.setActDuration(proj.getActDuration());
        root.setActStartDt(proj.getActStartDt());
        root.setActEndDt(proj.getActEndDt());
        root.setObjSt(proj.getBpolicyOID());
        root.setComplete(proj.getComplete());
        root.setWorkingDay(proj.getWorkingDay());
        root.setProgressRate(proj.getProgressRate());

        // 3) 전체 WBS 관계와 대상 프로세스 사전 로딩
        List<PmsRelationship> allWbs = pmsDAO.selPmsRelationship(
                PmsRelationship.builder().type(PmsConstant.RELATIONSHIP_WBS).rootOID(proj.getOid()).build());
        if (allWbs == null) allWbs = new ArrayList<>();
        List<Integer> toOids = allWbs.stream().map(PmsRelationship::getToOID).collect(Collectors.toList());
        List<PmsProcess> allProcList = toOids.isEmpty() ? new ArrayList<>() : pmsDAO.selPmsProcess(PmsProcess.builder().oids(toOids).build());
        Map<Integer, PmsProcess> procMap = new HashMap<>();
        if (allProcList != null) {
            for (PmsProcess p : allProcList) procMap.put(p.getOid(), p);
        }

        // 4) 재귀적으로 Children 구성
        buildWbsChildren(root, proj.getOid(), allWbs, procMap, proj);
        return root;
    }

    private void buildWbsChildren(PmsRelationship parent, Integer projectOid,
                                  List<PmsRelationship> allWbs,
                                  Map<Integer, PmsProcess> procMap,
                                  PmsProject proj) {
        parent.setRootOID(projectOid);
        List<PmsRelationship> children = allWbs.stream()
                .filter(r -> r.getFromOID() != null && r.getFromOID().equals(parent.getToOID()))
                .sorted((a, b) -> {
                    Integer ao = a.getOrd() == null ? 0 : a.getOrd();
                    Integer bo = b.getOrd() == null ? 0 : b.getOrd();
                    return ao.compareTo(bo);
                })
                .collect(Collectors.toList());
        parent.setChildren(children);
        if (children == null || children.isEmpty()) return;

        for (PmsRelationship item : children) {
            item.setLevel((parent.getLevel() == null ? 0 : parent.getLevel()) + 1);
            PmsProcess p = procMap.get(item.getToOID());
            if (p == null) continue; // 안전장치
            item.setObjName(p.getName());
            item.setDescription(p.getDescription());
            item.setObjType(p.getType());
            item.setEstDuration(p.getEstDuration());
            item.setEstStartDt(p.getEstStartDt());
            item.setEstEndDt(p.getEstEndDt());
            item.setActDuration(p.getActDuration());
            item.setActStartDt(p.getActStartDt());
            item.setActEndDt(p.getActEndDt());
            item.setObjSt(p.getBpolicyOID());
            item.setId(p.getId());
            item.setDependency(p.getDependency());
            item.setDependencyType(p.getDependencyType());
            item.setComplete(p.getComplete());
            item.setWorkingDay(proj.getWorkingDay());
            item.setNo(p.getNo());
            item.setProgressRate(p.getProgressRate());
            item.setIsSkipped(p.getIsSkipped());

            // 재귀 하위 구성
            buildWbsChildren(item, projectOid, allWbs, procMap, proj);
        }
    }

    public List<PmsProject> selProjects(PmsProject project) throws Exception {
        return pmsDAO.selPmsProject(project);
    }

    public int selPmsProjectCount(PmsProject project) throws Exception {
        return pmsDAO.selPmsProjectCount(project);
    }

    /** 템플릿 프로젝트 목록 조회 */
    public List<PmsProject> selTempProjects(PmsProject project) throws Exception {
        return pmsDAO.selTempPmsProject(project);
    }

    public int selTempPmsProjectCount(PmsProject project) throws Exception {
        return pmsDAO.selTempPmsProjectCount(project);
    }

    /** PM 변경 대상 프로젝트 목록 조회 */
    public List<PmsProject> selChangePmProjects() throws Exception {
        return pmsDAO.selChangePmObjects();
    }

    /** 단일 프로젝트 조회 (Object) */
    public PmsProject selProjectObject(PmsProject project) throws Exception {
        return pmsDAO.selPmsProjectObject(project);
    }

    /** 프로젝트 삭제: DObject 삭제 처리 */
    public Integer delProject(PmsProject project) throws Exception {
        if (project == null || project.getOid() == null || project.getOid() <= 0) {
            throw new CBizProcessFailException("유효하지 않은 프로젝트 OID");
        }
        DObject dObj = DObject.builder()
                .oid(project.getOid())
                .type(PmsConstant.TYPE_PROJECT)
                .build();
        return commonDAO.delDObject(dObj);
    }

    /** 프로젝트 일시중지: 프로젝트의 정책을 PAUSED로 변경 */
    public Integer pauseProject(PmsProject project) throws Exception {
        if (project == null || project.getOid() == null || project.getOid() <= 0) {
            throw new CBizProcessFailException("유효하지 않은 프로젝트 OID");
        }
        List<BPolicy> policies = bpolicyService.selBPolicys(BPolicy.builder().type(PmsConstant.TYPE_PROJECT).build());
        if (policies == null || policies.isEmpty()) throw new CBizProcessFailException("프로젝트 정책 정보를 찾을 수 없습니다.");
        Integer pausedOid = policies.stream()
                .filter(p -> PmsConstant.POLICY_PROJECT_PAUSED.equals(p.getName()))
                .map(BPolicy::getOid)
                .findFirst()
                .orElse(null);
        if (pausedOid == null) throw new CBizProcessFailException("일시중지 정책을 찾을 수 없습니다.");
        DObject dObj = DObject.builder()
                .oid(project.getOid())
                .bpolicyOID(pausedOid)
                .modifyUs(project.getModifyUs())
                .build();
        return dObjectService.udtDObject(dObj, project.getModifyUs());
    }

    /**
     * 프로젝트 PM 변경: 기존 PM이 포함된 모든 멤버 관계(ToOID)를 신규 PM으로 변경하고,
     * 프로젝트 DObject의 CreateUs를 신규 PM으로 갱신합니다.
     */
    public Integer udtPmProject(Integer projectOid, Integer pmOid, Integer reqUserUid) throws Exception {
        if (projectOid == null || projectOid <= 0) throw new CBizProcessFailException("유효하지 않은 프로젝트 OID");
        if (pmOid == null || pmOid <= 0) throw new CBizProcessFailException("유효하지 않은 PM OID");

        // 1) 전체 멤버 관계 조회
        List<PmsRelationship> members = pmsDAO.selPmsRelationship(
                PmsRelationship.builder()
                        .type(PmsConstant.RELATIONSHIP_MEMBER)
                        .rootOID(projectOid)
                        .build()
        );
        if (members == null || members.isEmpty()) return 0;

        // 2) 현재 PM 역할 관계 찾기 (RoleOID == PROJECT_ROLE_PM)
        PmsRelationship pmRel = members.stream()
                .filter(r -> r.getRoleOID() != null && r.getRoleOID().equals(PmsConstant.PROJECT_ROLE_PM))
                .findFirst()
                .orElse(null);

        if (pmRel == null) {
            // PM 역할이 없으면 아무것도 갱신하지 않음
            return 0;
        }

        Integer oldPmOid = pmRel.getToOID();
        if (oldPmOid == null || oldPmOid.equals(pmOid)) {
            // 동일 PM이면 관계 변경 불필요하지만 CreateUs는 갱신 수행 가능
        }

        int updated = 0;
        for (PmsRelationship rel : members) {
            if (rel.getToOID() != null && rel.getToOID().equals(oldPmOid)) {
                PmsRelationship upd = new PmsRelationship();
                upd.setOid(rel.getOid());
                upd.setToOID(pmOid);
                Integer res = pmsDAO.udtPmsRelationship(upd);
                if (res != null && res > 0) updated += res;
            }
        }

        // 3) 프로젝트 작성자(CreateUs) 변경
        DObject dObj = DObject.builder()
                .oid(projectOid)
                .createUs(pmOid)
                .modifyUs(reqUserUid)
                .build();
        dObjectService.udtCreateUsDObject(dObj, reqUserUid);

        return updated;
    }

    /**
     * 프로젝트 멤버 초기화: 프로젝트 루트의 멤버 관계(RELATIONSHIP_MEMBER) 중 루트에서 직접 연결된 멤버를 초기화(삭제 표시)합니다.
     * 기존 C# 구현과 동일하게 RootOID=FromOID=projectOid, Type=RELATIONSHIP_MEMBER로 Mapper Pms.PmsMemberReset 호출
     */
    public Integer memberReset(Integer projectOid, Integer reqUserUid) throws Exception {
        if (projectOid == null || projectOid <= 0) throw new CBizProcessFailException("유효하지 않은 프로젝트 OID");
        PmsRelationship param = PmsRelationship.builder()
                .rootOID(projectOid)
                .fromOID(projectOid)
                .type(PmsConstant.RELATIONSHIP_MEMBER)
                .deleteUs(reqUserUid)
                .build();
        Integer res = pmsDAO.pmsMemberReset(param);
        return res == null ? 0 : res;
    }

    /** OID 기준 단건 조회 편의 메소드 */
    public PmsProject selProjectByOid(Integer oid) throws Exception {
        if (oid == null || oid <= 0) throw new CBizProcessFailException("유효하지 않은 프로젝트 OID");
        return pmsDAO.selPmsProjectObject(PmsProject.builder().oid(oid).build());
    }

    /** OID 기준 단건 조회 편의 메소드 */
    public PmsProject selProjectTemplateByOid(Integer oid) throws Exception {
        if (oid == null || oid <= 0) throw new CBizProcessFailException("유효하지 않은 프로젝트 OID");
        return pmsDAO.selPmsProjectObject(PmsProject.builder().oid(oid).isTemplate("Y").build());
    }

    /** 단일 프로세스 조회 (OID 기준), BPolicy & Auths 포함 */
    public PmsProcess selPmsProcessObject(Integer procOid, Integer reqUserUid) throws Exception {
        if (procOid == null || procOid <= 0) throw new CBizProcessFailException("유효하지 않은 프로세스 OID");
        List<PmsProcess> list = pmsDAO.selPmsProcess(PmsProcess.builder().oid(procOid).build());
        if (list == null || list.isEmpty()) return null;
        PmsProcess proc = list.get(0);
        try {
            if (proc.getProcessType() != null && proc.getBpolicyOID() != null) {
                BPolicy pol = bpolicyService.selBPolicy(BPolicy.builder().type(proc.getProcessType()).oid(proc.getBpolicyOID()).build());
                proc.setBpolicy(pol);
            }
        } catch (Exception e) {
            log.warn("Failed to load BPolicy for PmsProcess oid={}, type={}, policyOID={}", proc.getOid(), proc.getProcessType(), proc.getBpolicyOID(), e);
        }
        try {
            List<BPolicyAuth> auths = bPolicyAuthService.mainAuth(reqUserUid, proc, null);
            proc.setBpolicyAuths(auths);
        } catch (Exception e) {
            log.warn("Failed to compute BPolicyAuths for PmsProcess oid={}", proc.getOid(), e);
        }
        return proc;
    }

    /**
     * C# SelMembers 대응: RootOID, FromOID 기준으로 MEMBER 관계 검색 및 사용자/역할 정보 보강
     */
    public List<PmsRelationship> selMembers(Integer rootOid, Integer fromOid) throws Exception {
        if (rootOid == null || rootOid <= 0) throw new CBizProcessFailException("유효하지 않은 RootOID");
        if (fromOid == null || fromOid <= 0) throw new CBizProcessFailException("유효하지 않은 FromOID");

        PmsRelationship param = PmsRelationship.builder()
                .type(PmsConstant.RELATIONSHIP_MEMBER)
                .rootOID(rootOid)
                .fromOID(fromOid)
                .build();

        List<PmsRelationship> list = pmsDAO.selPmsRelationship(param);
        if (list == null) list = new ArrayList<>();

        List<PmsRelationship> result = new ArrayList<>();
        Set<Integer> addedToOids = new HashSet<>();

        for (PmsRelationship member : list) {
            Integer toOid = member.getToOID();
            if (toOid == null) continue;
            if (addedToOids.contains(toOid)) continue; // 중복 사용자 스킵

            // 역할명 조회 (BDefine.Description)
            if (member.getRoleOID() != null) {
                try {
                    BDefine def = commonDAO.selBDefine(new BDefine(null, null, null));
                    // 위 메서드는 type/name 기반이 아니므로 OID 조회를 위한 확장이 필요할 수 있음.
                    // 현재 공용 Mapper는 selBDefine가 WHERE 절 없는 단순 사용일 수 있어 보정: 별도 구현 없이 스킵
                } catch (Exception ignore) { }
            }

            // Person 조회
            Person p = personDAO.selPersonById(toOid);
            if (p == null) continue;

            // HiddenGuest가 Y이고 역할명이 GUEST이면 제외
            try {
                if (p.getHiddenGuest() != null && p.getHiddenGuest().equals(CommonConstant.PERSON_ACTION_HIDDEN_GUEST)) {
                    // 역할명이 GUEST 인지 확인은 member.roleOIDNm 사용이 이상적이나 위에서 미확정. 대신 ROLE_OID가 GUEST 정의와 매칭 필요.
                    // 현 구조에서는 ROLE_OIDNm 매핑 미구현시에도 HiddenGuest 사용자는 제외하지 않고, ROLE_NM 비교 불가하므로 보수적으로 포함.
                }
            } catch (Exception ignore) {}

            // 정보 보강
            member.setPersonNm(p.getName());
            member.setDepartmentNm(p.getDepartmentNm());
            member.setJobTitleOrd(p.getJobTitleOrd());
            member.setJobTitleNm(p.getJobTitleNm());
            member.setEmail(p.getEmail());
            member.setThumbnail(p.getThumbnail());

            result.add(member);
            addedToOids.add(toOid);
        }

        // 정렬: 직급 순서 유효 여부 desc -> 직급 순서 asc -> 이름 asc
        result.sort((a, b) -> {
            boolean aHas = a.getJobTitleOrd() != null;
            boolean bHas = b.getJobTitleOrd() != null;
            if (aHas != bHas) return Boolean.compare(bHas, aHas); // true 먼저
            Integer ao = a.getJobTitleOrd() == null ? Integer.MAX_VALUE : a.getJobTitleOrd();
            Integer bo = b.getJobTitleOrd() == null ? Integer.MAX_VALUE : b.getJobTitleOrd();
            int cmp = ao.compareTo(bo);
            if (cmp != 0) return cmp;
            String an = a.getPersonNm() == null ? "" : a.getPersonNm();
            String bn = b.getPersonNm() == null ? "" : b.getPersonNm();
            return an.compareTo(bn);
        });

        return result;
    }

    public List<PmsProcess> selProjectWBS(Integer pjtOid) throws Exception {
        List<Integer> processOids =
                pmsDAO.selPmsRelationship(PmsRelationship.builder().type(PmsConstant.RELATIONSHIP_WBS).rootOID(pjtOid).build())
                        .stream().map(PmsRelationship::getToOID)
                        .toList();
        return pmsDAO.selPmsProcess(PmsProcess.builder().oids(processOids).build());
    }

    public PmsWbs selProjectTreeWBS(Integer pjtOid) throws Exception{
        // 프로젝트 검색
        PmsProject projectDto = new PmsProject();
        projectDto.setOid(pjtOid);
        PmsProject project = pmsDAO.selPmsProjectObject(projectDto);

        // WBS Relation 검색
        PmsWbs wbsDto = new PmsWbs();
        wbsDto.setRootOid(pjtOid);
        List<PmsWbs> list = pmsDAO.selPmsWbs(wbsDto);

        // 멤버 검색
        PmsWbsMember memberDto = new PmsWbsMember();
        memberDto.setRootOid(pjtOid);
        List<PmsWbsMember> members = pmsDAO.selPmsWbsMember(memberDto);

        PmsWbs projectWbs = projectToWbs(pjtOid, project);
        projectWbs.setChildren(buildWbsTree(list, members, pjtOid));

        return projectWbs;
    }

    @NotNull
    private static PmsWbs projectToWbs(Integer pjtOid, PmsProject project) {
        PmsWbs projectWbs = new PmsWbs();
        projectWbs.setProcessType(PmsConstant.TYPE_PROJECT);
        projectWbs.setRootOid(pjtOid);
        projectWbs.setFromOid(pjtOid);
        projectWbs.setOid(pjtOid);
        projectWbs.setName(project.getName());
        projectWbs.setLevel(0);
        projectWbs.setComplete(project.getComplete());
        projectWbs.setNo(projectWbs.getNo());
        projectWbs.setId(projectWbs.getId());
        projectWbs.setActStartDt(project.getActStartDt());
        projectWbs.setActEndDt(project.getActEndDt());
        projectWbs.setActDuration(project.getActDuration());
        projectWbs.setEstStartDt(project.getEstStartDt());
        projectWbs.setEstEndDt(project.getEstEndDt());
        projectWbs.setEstDuration(project.getEstDuration());
        projectWbs.setBPolicyOid(project.getBpolicyOID());
        projectWbs.setBPolicyNm(project.getBpolicyNm());
        return projectWbs;
    }

    private List<PmsWbs> buildWbsTree(List<PmsWbs> wbsList, List<PmsWbsMember> members, Integer parentOid) {
        // Filter child nodes based on parentOid
        List<PmsWbs> children = wbsList.stream()
                .filter(wbs -> Objects.equals(wbs.getFromOid(), parentOid))
                .collect(Collectors.toList());

        for (PmsWbs child : children) {
            // Associate members with the current WBS node
            List<PmsWbsMember> childMembers = members.stream()
                    .filter(member -> Objects.equals(member.getFromOid(), child.getOid()))
                    .collect(Collectors.toList());
            child.setMembers(childMembers);

            // Recursively build the tree for child nodes
            child.setChildren(buildWbsTree(wbsList, members, child.getOid()));
        }

        return children;
    }

    /**
     * 프로젝트의 모든 Task에 담당자가 존재하는지 검사합니다.
     * 하나라도 담당자(RELATIONSHIP_MEMBER)가 없는 Task가 있으면 0, 모두 있으면 1을 반환합니다.
     */
    public Integer projectMemberCheck(Integer projectOid) throws Exception {
        if (projectOid == null || projectOid <= 0) throw new CBizProcessFailException("유효하지 않은 프로젝트 OID");
        // 모든 WBS 항목의 ToOID 수집 후 Task 유형만 필터
        List<PmsRelationship> wbsList = pmsDAO.selPmsRelationship(
                PmsRelationship.builder().type(PmsConstant.RELATIONSHIP_WBS).rootOID(projectOid).build());
        if (wbsList == null || wbsList.isEmpty()) return 1; // WBS가 없으면 통과로 간주
        List<Integer> toOids = wbsList.stream().map(PmsRelationship::getToOID).toList();
        if (toOids == null || toOids.isEmpty()) return 1;
        List<PmsProcess> processes = pmsDAO.selPmsProcess(PmsProcess.builder().oids(toOids).build());
        if (processes == null || processes.isEmpty()) return 1;
        // Task만 추출
        List<PmsProcess> tasks = processes.stream()
                .filter(p -> PmsConstant.TYPE_TASK.equalsIgnoreCase(p.getType()))
                .collect(Collectors.toList());
        if (tasks.isEmpty()) return 1;
        // 각 Task에 대해 멤버 존재 여부 확인
        for (PmsProcess task : tasks) {
            List<PmsRelationship> members = pmsDAO.selPmsRelationship(
                    PmsRelationship.builder()
                            .type(PmsConstant.RELATIONSHIP_MEMBER)
                            .fromOID(task.getOid())
                            .rootOID(projectOid)
                            .build()
            );
            if (members == null || members.isEmpty()) {
                return 0; // 담당자가 없는 Task 발견
            }
        }
        return 1; // 모든 Task에 멤버가 있음
    }

    /**
     * Insert Project: create DObject row then DPMS_PROJECT row. Returns new OID.
     */
    //TODO: Transaction 처리 필요
    public Integer insProject(PmsProject project) throws Exception {
        // 1) DObject 생성 (Type 기본값 처리)
        String type = project.getType() == null ? PmsConstant.TYPE_PROJECT : project.getType();
        DObject dobj = DObject.builder()
                .type(type)
                .tableNm(PmsConstant.TABLE_PROJECT)
                .name(project.getName())
                .description(project.getDescription())
                .createUs(project.getCreateUs())
                .build();
        Integer resultOid = dObjectService.insDObject(dobj);
        if (resultOid == null || resultOid <= 0) throw new CBizProcessFailException("DObject 생성 실패");

        // 2) 프로젝트 기본값 셋팅 (Complete, EstStart/End/Dur 등)
        project.setOid(resultOid);
        if (project.getComplete() == null) project.setComplete(PmsConstant.INIT_COMPLETE);
        if (project.getEstStartDt() == null) project.setEstStartDt(project.getBaseDt());
        if (project.getEstDuration() == null) project.setEstDuration(PmsConstant.INIT_DURATION);
        // 단순 캘린더 일수 기준 종료일 계산 (영업일/휴일 고려 로직은 별도 유틸 도입 시 교체)
        if (project.getEstStartDt() != null && project.getEstDuration() != null) {
            java.util.Calendar cal = java.util.Calendar.getInstance();
            cal.setTime(project.getEstStartDt());
            cal.add(java.util.Calendar.DATE, project.getEstDuration());
            project.setEstEndDt(cal.getTime());
        }
        // 3) 프로젝트 상세 Insert
        pmsDAO.insPmsProject(project);

        // 4) 프로젝트 PM 멤버 관계 생성
        Integer pmToOid = null;
        if (project.getPmOID() != null && project.getPmOID() > 0) {
            pmToOid = project.getPmOID();
        } else {
            // PM 지정이 없으면 생성자를 기본 멤버로 지정
            pmToOid = project.getCreateUs();
        }
        if (pmToOid != null && pmToOid > 0) {
            PmsRelationship rel = PmsRelationship.builder()
                    .type(PmsConstant.RELATIONSHIP_MEMBER)
                    .fromOID(resultOid)
                    .toOID(pmToOid)
                    .rootOID(resultOid)
                    .roleOID(PmsConstant.PROJECT_ROLE_PM)
                    .createUs(project.getCreateUs())
                    .ord(999)
                    .build();
            pmsDAO.insPmsRelationship(rel);
        }

        // 5) 템플릿 기반 관계 복제 (MEMBER, DOC_MASTER)
        if (project.getTemplateOID() != null && project.getTemplateOID() > 0) {
            Integer templateRootOid = project.getBaseProjectOID() != null && project.getBaseProjectOID() > 0
                    ? project.getBaseProjectOID() : project.getTemplateOID();
            String content = project.getTemplateContent();
            // WBS 복제: 템플릿/베이스 프로젝트의 WBS를 신규 프로젝트로 복제
            if (content != null && content.contains(PmsConstant.RELATIONSHIP_WBS)) {
                // 1) 원본 프로젝트 결정 (베이스 프로젝트가 우선)
                PmsProject tmpProj = null;
                if (project.getBaseProjectOID() != null && project.getBaseProjectOID() > 0) {
                    List<PmsProject> list = pmsDAO.selPmsProject(PmsProject.builder().oid(project.getBaseProjectOID()).build());
                    if (list != null && !list.isEmpty()) tmpProj = list.get(0);
                } else {
                    List<PmsProject> list = pmsDAO.selPmsProject(PmsProject.builder().oid(project.getTemplateOID()).build());
                    if (list != null && !list.isEmpty()) tmpProj = list.get(0);
                }

                // 2) 신규 프로젝트 조회 (WorkingDay 등 사용)
                PmsProject cProj = null;
                List<PmsProject> createdList = pmsDAO.selPmsProject(PmsProject.builder().oid(resultOid).build());
                if (createdList != null && !createdList.isEmpty()) cProj = createdList.get(0);

                if (tmpProj != null && cProj != null) {
                    // 휴일 목록은 현재 미구현이므로 null 전달 (필요 시 CommonDAO 확장)
                    List<java.util.Date> lHoliday = null;

                    // 3) 원본 WBS 관계 조회
                    List<PmsRelationship> lWbs = pmsDAO.selPmsRelationship(
                            PmsRelationship.builder().type(PmsConstant.RELATIONSHIP_WBS).rootOID(tmpProj.getOid()).build());

                    java.util.List<java.util.Date> endDateTimes = new java.util.ArrayList<>();
                    java.util.Map<Integer, Integer> mapperOid = new java.util.HashMap<>();

                    // 4) 1차 루프: 프로세스 생성 및 매핑
                    for (PmsRelationship wbs : lWbs) {
                        // 프로젝트 루트 매핑 처리
                        if (PmsConstant.TYPE_PROJECT_TEMP.equals(wbs.getObjType()) || PmsConstant.TYPE_PROJECT.equals(wbs.getObjType())) {
                            mapperOid.put(tmpProj.getOid(), resultOid);
                            continue;
                        }

                        // 프로세스용 DObject 생성
                        DObject tmpDobj = DObject.builder()
                                .type(wbs.getObjType())
                                .tableNm(PmsConstant.TABLE_PROCESS)
                                .name(wbs.getObjName())
                                .createUs(project.getCreateUs())
                                .build();
                        Integer targetOid = dObjectService.insDObject(tmpDobj);

                        if (targetOid != null && targetOid > 0) {
                            // EstGap 계산: 원본 프로젝트 시작일과 원본 작업 시작일 간 격차를 신규 캘린더로 이동
                            int workingDay = cProj.getWorkingDay() == null ? 5 : cProj.getWorkingDay();
                            java.util.Date baseFrom = tmpProj.getEstStartDt();
                            java.util.Date baseTaskStart = wbs.getEstStartDt();
                            int estGap = com.papsnet.openissue.util.PmsUtils.calculateGapFutureDuration(baseFrom, baseTaskStart, workingDay, lHoliday);

                            PmsProcess tmpProc = PmsProcess.builder()
                                    .oid(targetOid)
                                    .processType(wbs.getObjType())
                                    .id(wbs.getId())
                                    .dependency(wbs.getDependency())
                                    .estDuration(wbs.getEstDuration())
                                    .level(wbs.getLevel())
                                    .complete(PmsConstant.INIT_COMPLETE)
                                    .no(wbs.getNo())
                                    .build();

                            // 신규 프로젝트의 시작일로부터 EstGap 반영한 시작일 계산
                            java.util.Date calcStart = com.papsnet.openissue.util.PmsUtils.calculateFutureDate(cProj.getEstStartDt(), estGap, workingDay, lHoliday);
                            tmpProc.setEstStartDt(calcStart);
                            // 종료일 계산: 시작일 + 기간
                            int duration = tmpProc.getEstDuration() == null ? PmsConstant.INIT_DURATION : tmpProc.getEstDuration();
                            java.util.Date calcEnd = com.papsnet.openissue.util.PmsUtils.calculateFutureDate(tmpProc.getEstStartDt(), duration, workingDay, lHoliday);
                            tmpProc.setEstEndDt(calcEnd);

                            // 프로세스 상세 Insert
                            pmsDAO.insPmsProcess(tmpProc);

                            // 매핑과 종료일 수집
                            if (wbs.getToOID() != null)
                                mapperOid.put(wbs.getToOID(), targetOid);
                            if (tmpProc.getEstEndDt() != null)
                                endDateTimes.add(tmpProc.getEstEndDt());
                        }
                    }

                    // 5) 프로젝트 종료일/기간 업데이트
                    if (!endDateTimes.isEmpty()) {
                        java.util.Date maxEnd = endDateTimes.stream().max(java.util.Date::compareTo).orElse(null);
                        int workingDay = cProj.getWorkingDay() == null ? 5 : cProj.getWorkingDay();
                        Integer estDur = com.papsnet.openissue.util.PmsUtils.calculateFutureDuration(cProj.getEstStartDt(), maxEnd, workingDay, lHoliday);
                        pmsDAO.udtPmsProject(PmsProject.builder()
                                .oid(cProj.getOid())
                                .estEndDt(maxEnd)
                                .estDuration(estDur)
                                .build());
                    }

                    // 6) 2차 루프: 관계 매핑 생성
                    for (PmsRelationship wbs : lWbs) {
                        if (PmsConstant.TYPE_PROJECT_TEMP.equals(wbs.getObjType()) || PmsConstant.TYPE_PROJECT.equals(wbs.getObjType())) {
                            continue;
                        }
                        Integer mappedFrom = wbs.getFromOID() == null ? null : mapperOid.get(wbs.getFromOID());
                        Integer mappedTo = wbs.getToOID() == null ? null : mapperOid.get(wbs.getToOID());
                        if (mappedFrom == null || mappedTo == null) continue; // 매핑 안된 항목 스킵

                        PmsRelationship newRel = PmsRelationship.builder()
                                .rootOID(resultOid)
                                .fromOID(mappedFrom)
                                .toOID(mappedTo)
                                .ord(wbs.getOrd())
                                .type(wbs.getType())
                                .createUs(project.getCreateUs())
                                .build();
                        pmsDAO.insPmsRelationship(newRel);
                    }

                    // MEMBER 복제: mapperOid가 매핑된 항목만 생성하고 PM 역할은 중복 방지
                    if (content != null && content.contains(PmsConstant.RELATIONSHIP_MEMBER)) {
                        List<PmsRelationship> lMember = pmsDAO.selPmsRelationship(
                                PmsRelationship.builder().type(PmsConstant.RELATIONSHIP_MEMBER).rootOID(tmpProj.getOid()).build());
                        if (lMember != null) {
                            for (PmsRelationship item : lMember) {
                                // 방금 생성한 PM 역할은 제외
                                if (item.getRoleOID() != null && item.getRoleOID().equals(PmsConstant.PROJECT_ROLE_PM)) continue;
                                // FromOID 매핑이 없으면 스킵
                                if (item.getFromOID() == null || !mapperOid.containsKey(item.getFromOID())) continue;

                                PmsRelationship newRel = PmsRelationship.builder()
                                        .type(PmsConstant.RELATIONSHIP_MEMBER)
                                        .fromOID(mapperOid.get(item.getFromOID()))
                                        .toOID(item.getToOID())
                                        .rootOID(resultOid)
                                        .ord(item.getOrd())
                                        .roleOID(item.getRoleOID())
                                        .createUs(project.getCreateUs())
                                        .build();
                                pmsDAO.insPmsRelationship(newRel);
                            }
                        }
                    }

                    // DOC_MASTER 복제: mapperOid가 매핑된 항목만 생성
                    if (content != null && content.contains(PmsConstant.RELATIONSHIP_DOC_MASTER)) {
                        List<PmsRelationship> lDocMaster = pmsDAO.selPmsRelationship(
                                PmsRelationship.builder().type(PmsConstant.RELATIONSHIP_DOC_MASTER).rootOID(tmpProj.getOid()).build());
                        if (lDocMaster != null) {
                            for (PmsRelationship item : lDocMaster) {
                                if (item.getFromOID() == null || !mapperOid.containsKey(item.getFromOID())) continue;

                                PmsRelationship newRel = PmsRelationship.builder()
                                        .type(PmsConstant.RELATIONSHIP_DOC_MASTER)
                                        .fromOID(mapperOid.get(item.getFromOID()))
                                        .toOID(item.getToOID())
                                        .rootOID(resultOid)
                                        .ord(item.getOrd())
                                        .createUs(project.getCreateUs())
                                        .build();
                                pmsDAO.insPmsRelationship(newRel);
                            }
                        }
                    }
                }
            }
        }

        return resultOid;
    }

    /**
     * Update Project: updates DObject (name/description/policy/thumbnail) and DPMS_PROJECT fields.
     */
    public Integer udtProject(PmsProject project) throws Exception {
        return pmsDAO.udtPmsProject(project);
    }

    // =====================
    // Process (PmsProcess)
    // =====================

    /** C# InsPmsProcess -> Java */
    public Integer insPmsProcess(PmsProcess param) throws Exception {
        return pmsDAO.insPmsProcess(param);
    }

    /** C# UdtPmsProcess -> Java */
    public Integer udtPmsProcess(PmsProcess param) throws Exception {
        return pmsDAO.udtPmsProcess(param);
    }

    /** C# UdtPmsProcessDependency -> Java */
    public Integer udtPmsProcessDependency(PmsProcess param) throws Exception {
        return pmsDAO.udtPmsProcessDependency(param);
    }

    /** C# SelPmsProcess (single) -> Java */
    public PmsProcess selPmsProcess(PmsProcess param) throws Exception {
        List<PmsProcess> list = pmsDAO.selPmsProcess(param);
        if (list == null || list.isEmpty()) return null;
        PmsProcess p = list.get(0);
        // Enrich BPolicy
        if (p.getBpolicyOID() != null) {
            BPolicy bp = commonDAO.selBPolicy(new BPolicy(p.getType(), p.getBpolicyOID()));
            p.setBpolicy(bp);
        }
        // Auths placeholder (no session/user context here)
        p.setBpolicyAuths(new ArrayList<>());
        return p;
    }

    /** C# SelPmsProcessOIDs (basic) -> Java */
    public List<PmsProcess> selPmsProcessOIDs(PmsProcess param) throws Exception {
        List<PmsProcess> list = pmsDAO.selPmsProcess(param);
        if (list == null || list.isEmpty()) return new ArrayList<>();
        List<Integer> policyOids = list.stream()
                .map(PmsProcess::getBpolicyOID)
                .filter(java.util.Objects::nonNull)
                .distinct().toList();
        List<BPolicy> policies = policyOids.isEmpty() ? new ArrayList<>() :
                bpolicyService.selBPolicyOIDs(new BPolicy(null, null, policyOids));
        for (PmsProcess proc : list) {
            if (proc.getBpolicyOID() != null && policies != null) {
                BPolicy bp = policies.stream().filter(b -> java.util.Objects.equals(b.getOid(), proc.getBpolicyOID())).findFirst().orElse(null);
                proc.setBpolicy(bp);
            }
            proc.setBpolicyAuths(new ArrayList<>());
        }
        return list;
    }

    /** C# SelPmsProcessOIDs with members/auth prefetch -> Java */
    public List<PmsProcess> selPmsProcessOIDs(PmsProcess param, List<PmsRelationship> members, List<BPolicyAuth> policyAuths) throws Exception {
        List<PmsProcess> list = pmsDAO.selPmsProcess(param);
        if (list == null || list.isEmpty()) return new ArrayList<>();
        List<Integer> policyOids = list.stream()
                .map(PmsProcess::getBpolicyOID)
                .filter(java.util.Objects::nonNull)
                .distinct().toList();
        List<BPolicy> policies = policyOids.isEmpty() ? new ArrayList<>() :
                bpolicyService.selBPolicyOIDs(new BPolicy(null, null, policyOids));
        for (PmsProcess proc : list) {
            if (proc.getBpolicyOID() != null && policies != null) {
                BPolicy bp = policies.stream().filter(b -> java.util.Objects.equals(b.getOid(), proc.getBpolicyOID())).findFirst().orElse(null);
                proc.setBpolicy(bp);
            }
            // Without user context, we cannot filter policyAuths accurately; attach empty or the provided list if needed.
            proc.setBpolicyAuths(new ArrayList<>());
        }
        return list;
    }

    /** C# SelPmsProcessList -> Java */
    public List<PmsProcess> selPmsProcessList(PmsProcess param) throws Exception {
        List<PmsProcess> list = pmsDAO.selPmsProcess(param);
        if (list == null || list.isEmpty()) return new ArrayList<>();
        // Load all policies (by type if available) and map
        List<BPolicy> allPolicies = bpolicyService.selBPolicyOIDs(new BPolicy(param.getType(), null));
        for (PmsProcess proc : list) {
            if (proc.getBpolicyOID() != null && allPolicies != null) {
                BPolicy bp = allPolicies.stream().filter(b -> java.util.Objects.equals(b.getOid(), proc.getBpolicyOID())).findFirst().orElse(null);
                proc.setBpolicy(bp);
            }
        }
        return list;
    }

    /**
     * 고객사(OEM) - 차종 트리 조회
     * C# SelTotalProjMngt(Session, Type) 대응 (Session 미사용, reqUserUid 파라미터로 대체)
     */
    public List<JqTreeModel> selOemCarTree(String type) {
        List<JqTreeModel> roots = new ArrayList<>();
        try {
            // 1) OEM 루트 목록: CodeLibrary에서 Code1='OEM'의 자식 목록
            DLibrary oemCond = DLibrary.builder().code1(CommonConstant.ATTRIBUTE_OEM).build();
            List<DLibrary> oems = dLibraryService.SelCodeLibraryChild(oemCond);

            if (oems != null) {
                for (DLibrary oem : oems) {
                    JqTreeModel root = new JqTreeModel();
                    root.setId(oem.getOid());
                    root.setLabel(oem.getKorNm());
                    root.setIcon(CommonConstant.ICON_COMPANY);
                    root.setIconsize(CommonConstant.DEFAULT_ICONSIZE);
                    root.setExpanded(true);
                    root.setType(PmsConstant.ATTRIBUTE_OEM);
                    root.setItems(new ArrayList<>());

                    // 2) 차종 목록: 해당 OEM 하위에서 Code1='CARTYPE'의 자식 목록
                    DLibrary carCategoryCond = DLibrary.builder()
                            .fromOID(oem.getOid())
                            .code1(CommonConstant.ATTRIBUTE_CARTYPE)
                            .build();
                    List<DLibrary> cars = dLibraryService.SelCodeLibraryChild(carCategoryCond);

                    if (cars != null) {
                        cars.stream()
                                .sorted(Comparator.comparing(l -> l.getKorNm() == null ? "" : l.getKorNm().trim()))
                                .forEach(car -> {
                                    JqTreeModel node = new JqTreeModel();
                                    node.setId(car.getOid());
                                    node.setLabel(car.getKorNm());
                                    node.setIcon(PmsConstant.ICON_CARTYPE);
                                    node.setIconsize(PmsConstant.DEFAULT_ICONSIZE);
                                    node.setExpanded(true);
                                    node.setType(PmsConstant.ATTRIBUTE_CAR);
                                    node.setParentId(oem.getOid());
                                    node.setItems(new ArrayList<>());

                                    // 프로젝트 하위 노드 추가 (TYPE_TOTAL일 때만)
                                    if (PmsConstant.TYPE_TOTAL.equals(type)) {
                                        try {
                                            selCarLibrary(node, car.getOid());
                                        } catch (Exception ex) {
                                            log.warn("selCarLibrary failed for carOid={}: {}", car.getOid(), ex.getMessage());
                                        }
                                    }
                                    root.getItems().add(node);
                                });
                    }

                    roots.add(root);
                }
            }

            // 3) OEM 정렬 (라벨 기준)
            roots.sort(Comparator.comparing(m -> m.getLabel() == null ? "" : m.getLabel().trim()));
        } catch (Exception e) {
            log.error("selOemCarTree error: {}", e.getMessage());
        }
        return roots;
    }

    /**
     * C# SelCarLibrary 대응: 특정 차종(carOid)에 속한 프로젝트를 트리 노드로 추가
     */
    private void selCarLibrary(JqTreeModel parent, Integer carOid) throws Exception {
        if (parent.getItems() == null) parent.setItems(new ArrayList<>());
        PmsProject cond = PmsProject.builder()
                .type(PmsConstant.TYPE_PROJECT)
                .carLibOID(carOid)
                .build();
        List<PmsProject> projects = pmsDAO.selPmsProject(cond);
        if (projects == null) return;
        for (PmsProject item : projects) {
            JqTreeModel projNode = new JqTreeModel();
            projNode.setId(item.getOid());
            projNode.setLabel(item.getName());
            projNode.setIcon(CommonConstant.ICON_DEPARTMENT);
            projNode.setIconsize(CommonConstant.DEFAULT_ICONSIZE);
            projNode.setExpanded(true);
            projNode.setType(PmsConstant.TYPE_PROJECT);
            parent.getItems().add(projNode);
        }
    }
}
