package com.papsnet.openissue.biz.project.controller;


import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.biz.project.dto.PmsProcess;
import com.papsnet.openissue.biz.project.dto.PmsProject;
import com.papsnet.openissue.biz.project.dto.PmsRelationship;
import com.papsnet.openissue.biz.project.dto.PmsWbs;
import com.papsnet.openissue.biz.project.service.PmsService;
import com.papsnet.openissue.common.constant.PmsConstant;
import com.papsnet.openissue.common.dto.DataResult;
import com.papsnet.openissue.common.dto.ListResult;
import com.papsnet.openissue.common.dto.JqTreeModel;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "프로젝트 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pms")
public class PmsController {

    private final PmsService pmsService;
    private final ResponseService responseService;

    @Operation(summary = "프로젝트 목록 조회", description = "검색 조건으로 프로젝트 목록을 조회합니다.")
    @RequestMapping(value = "/projects", method = {RequestMethod.POST})
    public ListResult<PmsProject> selProjects(
            @RequestBody PmsProject cond,
            @Parameter(description = "페이지 번호 (1-based)") @RequestParam(required = false) Integer offset,
            @Parameter(description = "limit (page size)") @RequestParam(required = false) Integer limit,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            if (offset != null) cond.setPageNum(offset);
            if (limit != null) cond.setPageCount(limit);
            cond.setType(PmsConstant.TYPE_PROJECT);
            List<PmsProject> resultSet = pmsService.selProjects(cond);

            int totalCount;
            int pageSize;
            int currentPage;
            int rowCountPerPage;

            if (offset != null && limit != null) {
                totalCount = pmsService.selPmsProjectCount(cond);
                pageSize = limit;
                rowCountPerPage = (resultSet != null) ? resultSet.size() : 0; // current page item count
                currentPage = (offset == null || offset <= 0) ? 1 : offset; // page param is 1-based
            } else {
                totalCount = resultSet != null ? resultSet.size() : 0;
                pageSize = totalCount;
                rowCountPerPage = totalCount; // equals current list size when no paging
                currentPage = 1;
            }

            return responseService.getListPageResult(resultSet, totalCount, pageSize, currentPage, rowCountPerPage);
        } catch (Exception e) {
            throw new CBizProcessFailException("프로젝트 검색 실패");
        }
    }

    @Operation(summary = "템플릿 프로젝트 목록 조회", description = "템플릿 유형의 프로젝트 목록을 조회합니다.")
    @RequestMapping(value = "/projects/temp", method = {RequestMethod.POST})
    public ListResult<PmsProject> selTempProjects(
            @RequestBody PmsProject cond,
            @Parameter(description = "페이지 번호 (1-based)") @RequestParam(required = false) Integer offset,
            @Parameter(description = "limit (page size)") @RequestParam(required = false) Integer limit,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            if (offset != null) cond.setPageNum(offset);
            if (limit != null) cond.setPageCount(limit);
            cond.setIsTemplate("Y");
            cond.setType(PmsConstant.TYPE_PROJECT_TEMP);
            List<PmsProject> resultSet = pmsService.selTempProjects(cond);

            int totalCount;
            int pageSize;
            int currentPage;
            int rowCountPerPage;

            if (offset != null && limit != null) {
                totalCount = pmsService.selTempPmsProjectCount(cond);
                pageSize = limit;
                rowCountPerPage = (resultSet != null) ? resultSet.size() : 0; // current page item count
                currentPage = (offset == null || offset <= 0) ? 1 : offset; // page param is 1-based
            } else {
                totalCount = resultSet != null ? resultSet.size() : 0;
                pageSize = totalCount;
                rowCountPerPage = totalCount; // equals current list size when no paging
                currentPage = 1;
            }

            return responseService.getListPageResult(resultSet, totalCount, pageSize, currentPage, rowCountPerPage);
        } catch (Exception e) {
            throw new CBizProcessFailException("템플릿 프로젝트 검색 실패");
        }
    }

    @Operation(summary = "PM 변경 대상 프로젝트 목록", description = "PM 변경 대상 프로젝트 목록을 조회합니다.")
    @RequestMapping(value = "/projects/change-pm", method = {RequestMethod.GET})
    public ListResult<PmsProject> selChangePmProjects(
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            return responseService.getListResult(pmsService.selChangePmProjects());
        } catch (Exception e) {
            throw new CBizProcessFailException("PM 변경 대상 프로젝트 검색 실패");
        }
    }

    @Operation(summary = "프로젝트 생성", description = "신규 프로젝트를 생성합니다. 본문에 프로젝트 정보를 전달하세요.")
    @RequestMapping(value = "/project/insert", method = {RequestMethod.POST})
    public DataResult<Integer> insProject(
            @RequestBody PmsProject pmsProject,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            pmsProject.setCreateUs(reqUserUid);
            return responseService.getDataResult(pmsService.insProject(pmsProject));
        } catch (Exception e) {
            throw new CBizProcessFailException("프로젝트 생성 실패");
        }
    }

    @Operation(summary = "멤버 관계 조회", description = "RootOID와 FromOID로 MEMBER 관계를 조회하고 사용자/역할 정보를 포함하여 반환합니다.")
    @RequestMapping(value = "/project/members", method = {RequestMethod.GET})
    public ListResult<PmsRelationship> selMembers(
            @Parameter(description = "RootOID", required = true) @RequestParam("rootOid") Integer rootOid,
            @Parameter(description = "FromOID", required = true) @RequestParam("fromOid") Integer fromOid,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            return responseService.getListResult(pmsService.selMembers(rootOid, fromOid));
        } catch (Exception e) {
            throw new CBizProcessFailException("멤버 관계 검색 실패");
        }
    }

    @Operation(summary = "프로젝트 WBS 조회", description = "프로젝트 OID로 WBS(작업 분해 구조) 목록을 조회합니다.")
    @RequestMapping(value = "/project/wbs/{pjtOid}", method = {RequestMethod.GET})
    public ListResult<PmsProcess> selProjectWBS(
            @Parameter(description = "프로젝트 OID", required = true, example = "1001")
            @PathVariable("pjtOid") Integer pjtOid,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            return responseService.getListResult(pmsService.selProjectWBS(pjtOid));
        } catch (Exception e) {
            throw new CBizProcessFailException("WBS 검색 실패");
        }
    }

    @Operation(summary = "프로젝트 WBS 조회 (트리)", description = "프로젝트 OID로 WBS 조회")
    @RequestMapping(value = "/project/wbs/tree/{pjtOid}", method = {RequestMethod.GET})
    public DataResult<PmsWbs> selProjectTreeWBS(
            @Parameter(description = "프로젝트 OID", required = true, example = "1001")
            @PathVariable("pjtOid") Integer pjtOid,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            if(pjtOid == null || pjtOid <= 0){
                throw new CBizProcessFailException("유효하지 않은 프로젝트 OID입니다.");
            }

            return responseService.getDataResult(pmsService.selProjectTreeWBS(pjtOid));
        } catch (Exception e) {
            throw new CBizProcessFailException("WBS 검색 실패");
        }
    }

    @Operation(summary = "프로젝트 멤버 할당 검증", description = "모든 Task에 담당자가 지정되어 있는지 확인합니다. 하나라도 비어있으면 0, 모두 지정되면 1 반환")
    @RequestMapping(value = "/project/member-check/{pjtOid}", method = {RequestMethod.GET})
    public DataResult<Integer> projectMemberCheck(
            @Parameter(description = "프로젝트 OID", required = true, example = "1001")
            @PathVariable("pjtOid") Integer pjtOid,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            return responseService.getDataResult(pmsService.projectMemberCheck(pjtOid));
        } catch (Exception e) {
            throw new CBizProcessFailException("프로젝트 멤버 할당 검증 실패");
        }
    }

    @Operation(summary = "WBS 트리 조회", description = "프로젝트 필터로 단일 프로젝트를 찾아 WBS 트리 구조를 반환합니다.")
    @RequestMapping(value = "/project/wbs/structure", method = {RequestMethod.POST})
    public DataResult<PmsRelationship> selWbsStructure(
            @RequestBody PmsProject pmsProject,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            return responseService.getDataResult(pmsService.selWbsStructure(pmsProject));
        } catch (Exception e) {
            throw new CBizProcessFailException("WBS 트리 검색 실패");
        }
    }

    @Operation(summary = "고객사 차종 트리 조회", description = "고객사(OEM) 기준 차종 트리 데이터를 조회합니다.")
    @RequestMapping(value = "/project/oem-car-data", method = {RequestMethod.GET})
    public ListResult<JqTreeModel> selOemCarData(
            @Parameter(description = "트리 확장 타입: TOTAL이면 프로젝트까지 하위 확장") @RequestParam(required = false) String type,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            return responseService.getListResult(pmsService.selOemCarTree(type == null ? "" : type));
        } catch (Exception e) {
            throw new CBizProcessFailException("고객사 차종 트리 검색 실패");
        }
    }

    @Operation(summary = "프로젝트 단건 조회", description = "프로젝트 OID로 단일 프로젝트 정보를 반환합니다.")
    @RequestMapping(value = "/project/{pjtOid}", method = {RequestMethod.GET})
    public DataResult<PmsProject> selProject(
            @Parameter(description = "프로젝트 OID", required = true, example = "1001")
            @PathVariable("pjtOid") Integer pjtOid,
            @Parameter(description = "템플릿 여부", required = true)
            @RequestParam(required = false) String isTemplate) {
        try {
            PmsProject proj = null;
            if(isTemplate != null && isTemplate.equals("Y")) {
                proj = pmsService.selProjectTemplateByOid(pjtOid);
            }else{
                proj = pmsService.selProjectByOid(pjtOid);
            }
            if (proj == null) {
                throw new CBizProcessFailException("프로젝트를 찾을 수 없습니다.");
            }
            return responseService.getDataResult(proj);
        } catch (Exception e) {
            throw new CBizProcessFailException("프로젝트 조회 실패");
        }
    }

    @Operation(summary = "프로젝트 수정", description = "프로젝트 정보를 수정합니다. 전달된 값만 업데이트됩니다.")
    @RequestMapping(value = "/project/update", method = {RequestMethod.PUT, RequestMethod.POST})
    public DataResult<Integer> udtProject(
            @RequestBody PmsProject pmsProject,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            if (reqUserUid > 0) pmsProject.setModifyUs(reqUserUid);
            return responseService.getDataResult(pmsService.udtProject(pmsProject));
        } catch (Exception e) {
            throw new CBizProcessFailException("프로젝트 수정 실패");
        }
    }

    @Operation(summary = "프로젝트 삭제", description = "프로젝트를 삭제합니다. 본문에 OID를 포함하세요.")
    @RequestMapping(value = "/project/delete", method = {RequestMethod.POST})
    public DataResult<Integer> delProject(
            @RequestBody PmsProject pmsProject,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            return responseService.getDataResult(pmsService.delProject(pmsProject));
        } catch (Exception e) {
            throw new CBizProcessFailException("프로젝트 삭제 실패");
        }
    }

    @Operation(summary = "프로젝트 일시중지", description = "프로젝트의 상태를 일시중지로 변경합니다.")
    @RequestMapping(value = "/project/pause", method = {RequestMethod.POST})
    public DataResult<Integer> pauseProject(
            @RequestBody PmsProject pmsProject,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            if (reqUserUid > 0) pmsProject.setModifyUs(reqUserUid);
            return responseService.getDataResult(pmsService.pauseProject(pmsProject));
        } catch (Exception e) {
            throw new CBizProcessFailException("프로젝트 일시중지 실패");
        }
    }

    @Operation(summary = "프로젝트 PM 변경", description = "프로젝트의 PM을 변경합니다. 기존 PM이 담당 중인 프로젝트 멤버 관계도 새 PM으로 일괄 변경합니다.")
    @RequestMapping(value = "/project/change-pm", method = {RequestMethod.POST})
    public DataResult<Integer> udtPmProject(
            @Parameter(description = "프로젝트 OID", required = true) @RequestParam("pjtOid") Integer pjtOid,
            @Parameter(description = "신규 PM의 Person OID", required = true) @RequestParam("pmOid") Integer pmOid,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            return responseService.getDataResult(pmsService.udtPmProject(pjtOid, pmOid, reqUserUid));
        } catch (Exception e) {
            throw new CBizProcessFailException("프로젝트 PM 변경 실패");
        }
    }

    @Operation(summary = "프로세스 단건 조회", description = "프로세스 OID로 단일 프로세스 정보를 반환합니다. BPolicy 및 권한 정보 포함")
    @RequestMapping(value = "/process/{procOid}", method = {RequestMethod.GET})
    public DataResult<PmsProcess> selPmsProcessObject(
            @Parameter(description = "프로세스 OID", required = true) @PathVariable("procOid") Integer procOid,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            PmsProcess proc = pmsService.selPmsProcessObject(procOid, reqUserUid);
            if (proc == null) throw new CBizProcessFailException("프로세스를 찾을 수 없습니다.");
            return responseService.getDataResult(proc);
        } catch (Exception e) {
            throw new CBizProcessFailException("프로세스 조회 실패");
        }
    }

    @Operation(summary = "프로젝트 멤버 초기화", description = "프로젝트 루트의 멤버 관계를 초기화합니다. (RootOID=FromOID=프로젝트 OID)")
    @RequestMapping(value = "/project/member-reset", method = {RequestMethod.POST})
    public DataResult<Integer> memberReset(
            @Parameter(description = "프로젝트 OID", required = true) @RequestParam("pjtOid") Integer pjtOid,
            @Parameter(hidden = true) @RequestParam(required = false) int reqUserUid
    ) {
        try {
            return responseService.getDataResult(pmsService.memberReset(pjtOid, reqUserUid));
        } catch (Exception e) {
            throw new CBizProcessFailException("프로젝트 멤버 초기화 실패");
        }
    }

}
