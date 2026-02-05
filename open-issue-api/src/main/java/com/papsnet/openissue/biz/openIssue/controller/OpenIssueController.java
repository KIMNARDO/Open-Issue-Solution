package com.papsnet.openissue.biz.openIssue.controller;


import com.papsnet.openissue.biz.openIssue.dto.*;
import com.papsnet.openissue.biz.openIssue.service.OpenIssueService;
import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.constant.PmsConstant;
import com.papsnet.openissue.common.dto.*;
import com.papsnet.openissue.common.exception.*;
import com.papsnet.openissue.common.service.DLibraryService;
import com.papsnet.openissue.common.service.ResponseService;
import com.papsnet.openissue.common.service.HttpFileService;
import com.papsnet.openissue.translation.MachineTranslationModule;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@Slf4j
@Tag(name = "오픈이슈 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/openIssue")
public class OpenIssueController {
    private final ResponseService responseService;
    private final OpenIssueService openIssueService;
    private final DLibraryService dLibraryService;
    private final MachineTranslationModule machineTranslationModule;
    private final HttpFileService httpFileService;

    @Operation(summary = "개발 별 리스트 출력", description = "개발 별 리스트 출력")
    @RequestMapping(value = "/menu/{type}", method = RequestMethod.GET)
    public ListResult<FolderResult<Object>> findMenuList(
            @Parameter(description = "TYPE", required = true) @PathVariable String type,
            @RequestParam(name = "lang", required = false, defaultValue = "ko") String lang,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            if (lang.equals("en")) {
                return responseService.getListResult(machineTranslationModule.translateObjects(openIssueService.findMenuList(type, reqUserUid)));
            }
            return responseService.getListResult(openIssueService.findMenuList(type, reqUserUid));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 검색실패");
        }
    }

    @Operation(summary = "개발별 리스트 상세 보기", description = "개발별 리스트 상세 보기")
    @RequestMapping(value = "/menu/group/{oid}", method = RequestMethod.GET)
    public DataResult<OpenIssueGroupDef> findOpenIssueGroupDefById(
            @Parameter(description = "OID", required = true) @PathVariable Integer oid,
            @RequestParam(name = "lang", required = false, defaultValue = "ko") String lang,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
//            if (lang.equals("en")) {
//                return responseService.getDataResult(machineTranslationModule.translateObjects(openIssueService.findMenuById(oid, type)));
//            }
            return responseService.getDataResult(openIssueService.findOpenIssueGroupDefById(oid, reqUserUid));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 검색실패");
        }
    }

    @Operation(summary = "개발 별 리스트 생성", description = "개발 별 리스트 생성")
    @RequestMapping(value = "/menu/group/registration", method = RequestMethod.POST)
    public DataResult<OpenIssueGroupDef> insOpenIssueGroupDef(
            @Parameter(description = "개발별 리스트 정보", required = true) @RequestBody OpenIssueGroupDef cond,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            OpenIssueGroupDef data = openIssueService.createOpenIssueGroupDef(cond, reqUserUid);
            return responseService.getDataResult(data);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 검색실패");
        }
    }

    @Operation(summary = "개발 별 리스트 생성시 디폴트 인원 검색", description = "개발 별 리스트 디폴트 인원 검색")
    @RequestMapping(value = "/menu/group/default/member", method = RequestMethod.GET)
    public ListResult<OpenIssueRelationship> findOpenIssueGroupDefaultMemberList(
            @Parameter(description = "타입", required = true) @RequestParam String groupType,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            List<OpenIssueRelationship> data = openIssueService.findOpenIssueGroupDefaultMemberList(groupType, reqUserUid);
            return responseService.getListResult(data);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 의 담당자 및 참조자 검색실패");
        }
    }

    @Operation(summary = "개발 별 리스트 업데이트", description = "개발 별 리스트 업데이트")
    @RequestMapping(value = "/menu/group/update", method = RequestMethod.POST)
    public CommonResult uptOpenIssueGroupDef(
            @Parameter(description = "개발별 리스트 정보", required = true) @RequestBody OpenIssueGroupDef cond,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            openIssueService.modifyOpenIssueGroupDef(cond, reqUserUid);
            return responseService.getSuccessResult();
        } catch (CRequiredException e) {
            return responseService.getFailResult( CRequiredException.getCode(), CRequiredException.getCustomMessage());
        } catch (CInvalidArgumentException e) {
            return responseService.getFailResult( CInvalidArgumentException.getCode(), CInvalidArgumentException.getCustomMessage());
        } catch (CInvalidPasswordException e) {
            return responseService.getFailResult( CInvalidPasswordException.getCode(), CInvalidPasswordException.getCustomMessage());
        } catch (Exception e) {
            return responseService.getFailResult(CUnknownException.getCode(), CUnknownException.getCustomMessage());
        }
    }

    @Operation(summary = "개발 별 리스트 삭제", description = "개발 별 리스트 삭제")
    @RequestMapping(value = "/menu/group/remove/{oid}", method = RequestMethod.POST)
    public CommonResult removeOpenIssueGroupDef(
            @Parameter(description = "키", required = true) @PathVariable int oid,
//            @Parameter(description = "개발별 리스트 정보", required = true) @RequestBody OpenIssueGroupDef cond,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            OpenIssueGroupDef cond = new OpenIssueGroupDef();
            cond.setOid(oid);
            openIssueService.removeOpenIssueGroupDef(cond, reqUserUid);
            return responseService.getSuccessResult();
        } catch (CRequiredException e) {
            return responseService.getFailResult( CRequiredException.getCode(), CRequiredException.getCustomMessage());
        } catch (CInvalidArgumentException e) {
            return responseService.getFailResult( CInvalidArgumentException.getCode(), CInvalidArgumentException.getCustomMessage());
        } catch (CInvalidPasswordException e) {
            return responseService.getFailResult( CInvalidPasswordException.getCode(), CInvalidPasswordException.getCustomMessage());
        } catch (Exception e) {
            return responseService.getFailResult(CUnknownException.getCode(), CUnknownException.getCustomMessage());
        }
    }

    @Operation(summary = "개발 별 리스트 업데이트(상태 변경)", description = "개발 별 리스트 업데이트(상태 변경)")
    @RequestMapping(value = "/menu/group/status/update", method = RequestMethod.POST)
    public CommonResult uptOpenIssueGroupDefStatus(
            @Parameter(description = "개발별 리스트 정보", required = true) @RequestBody OpenIssueGroupDef cond,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            openIssueService.modifyOpenIssueGroupDefStatus(cond);
            return responseService.getSuccessResult();
        } catch (CRequiredException e) {
            return responseService.getFailResult( CRequiredException.getCode(), CRequiredException.getCustomMessage());
        } catch (CInvalidArgumentException e) {
            return responseService.getFailResult( CInvalidArgumentException.getCode(), CInvalidArgumentException.getCustomMessage());
        } catch (CInvalidPasswordException e) {
            return responseService.getFailResult( CInvalidPasswordException.getCode(), CInvalidPasswordException.getCustomMessage());
        } catch (Exception e) {
            return responseService.getFailResult(CUnknownException.getCode(), CUnknownException.getCustomMessage());
        }
    }

    @Operation(summary = "오픈이슈 의 담당자 및 참조자", description = "오픈이슈 의 담당자 및 참조자")
    @RequestMapping(value = "/member/{fromOid}", method = RequestMethod.GET)
    public ListResult<OpenIssueRelationship> findOpenIssueRelationshipList(
            @Parameter(description = "내 상위 OID", required = true) @PathVariable Integer fromOid,
//            @Parameter(description = "규칙 OID(27,28,29)", required = false) @PathVariable Integer roleOid,
//            @Parameter(description = "개발별 리스트 정보", required = true) @RequestBody OpenIssueRelationship cond,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            OpenIssueRelationship cond = new OpenIssueRelationship();
            cond.setFromOID(fromOid);
//            cond.setRootOid(roleOid);
            cond.setType(PmsConstant.RELATIONSHIP_MEMBER);
            return responseService.getListResult(openIssueService.findOpenIssueRelationshipList(cond));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 의 담당자 및 참조자 검색실패");
        }
    }

    @PostMapping("")
    public ListResult<OpenIssue> selAllIssues(
            @RequestBody OpenIssue openIssue,
            @RequestParam(name = "lang", required = false, defaultValue = "ko") String lang) {
        try {
            if (lang.equals("en")) {
                return responseService.getListResult(machineTranslationModule.translateObjects(openIssueService.selAllIssue(openIssue)));
            }
            return responseService.getListResult(openIssueService.selAllIssue(openIssue));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 검색실패");
        }
    }

	//TODO : 오픈이슈 검색 추가
    @PostMapping("/search")
    public ListResult<OpenIssue> searchIssue(
            @Parameter(description = "검색 데이터") @RequestParam Integer openIssueCategoryOid,
            @Parameter(description = "검색 데이터") @RequestParam Integer openIssueGroup,
            @Parameter(description = "타입") @RequestParam String openIssueType,
            @Parameter(description = "검색 데이터") @RequestParam(required = false) String searchWord,
            @Parameter(description = "언어") @RequestParam(name = "lang", required = false, defaultValue = "ko") String lang,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            OpenIssue openIssue = new OpenIssue();
            openIssue.setOpenIssueCategoryOid(openIssueCategoryOid);
            openIssue.setOpenIssueGroup(openIssueGroup);
            openIssue.setOpenIssueType(openIssueType);
            openIssue.setSearchWord(searchWord);

            //해당 부분 변경
            if (lang.equals("en")) {
                return responseService.getListResult(machineTranslationModule.translateObjects(openIssueService.searchIssue(openIssue)));
            }

            return responseService.getListResult(openIssueService.searchIssue(openIssue));

        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 검색실패");
        }
    }

    //TODO: 오픈이슈 등록 API 추가
    @Operation(summary = "오픈이슈 등록_v2", description = "오픈이슈 등록")
    @PostMapping("/registration_v2")
    public ListResult<OpenIssue> excelImportOpenIssue(
            @RequestBody List<OpenIssue> openIssues,
            @Parameter(description = "OID", hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            return responseService.getListResult(openIssueService.insertOpenIssues(openIssues, reqUserUid));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("이슈 등록 실패");
        }
    }


    @Operation(summary = "오픈이슈 등록", description = "오픈이슈 등록")
    @PostMapping("/registration")
    public DataResult<OpenIssue> insIssue(
            @RequestBody OpenIssue openIssue,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            return responseService.getDataResult(new OpenIssue());
//            return responseService.getDataResult(openIssueService.insertIssue(openIssue, reqUserUid));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("이슈 등록 실패");
        }

    }

    @PostMapping("/update")
    public DataResult<List<OpenIssue>> updateIssue(
            @RequestBody List<OpenIssue> issue,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            return responseService.getDataResult(openIssueService.updateIssue(issue, reqUserUid));
        } catch (Exception e) {
            throw new CBizProcessFailException("이슈 업데이트 실패");
        }
    }

    @PostMapping("/remove/{oid}")
    public DataResult<Integer> removeIssue(@PathVariable("oid") int oid,
                                           @Parameter(hidden = true) @RequestParam int reqUserUid) {
        try {
            return responseService.getDataResult(openIssueService.deleteIssue(oid, reqUserUid));
        } catch (Exception e) {
            throw new CBizProcessFailException("이슈 삭제 실패");
        }
    }

    @PostMapping("/remove/batch")
    public ListResult<OpenIssue> removeIssueBatch(
            @RequestBody List<OpenIssue> issues,
            @Parameter(hidden = true) @RequestParam int reqUserUid) {
        try {
            return responseService.getListResult(openIssueService.deleteIssueBatch(issues, reqUserUid));
        } catch (Exception e) {
            throw new CBizProcessFailException("이슈 삭제 실패");
        }
    }

    @GetMapping("/category")
    public ListResult<DLibrary> getCategory()  {
        try {
            return responseService.getListResult(dLibraryService.selLibraryObjects((CommonConstant.OPENISSUETYPE_OID)));
        } catch (Exception e) {
            throw new CBizProcessFailException("이슈 삭제 실패");
        }
    }

    @Operation(summary = "오픈이슈 첨부파일 등록", description = "오픈이슈 첨부파일 등록")
    @PostMapping(value = "/file/modify/{oid}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public CommonResult modifyFileOpenIssue(
            @Parameter(description = "OID", required = true) @PathVariable Integer oid,
            @Parameter(description = "첨부파일 목록", required = false) @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            String type = PmsConstant.TYPE_ISSUE_PROJECT;
            Integer row = null;
            String tempPartNo = null;

            // 파일 업로드 및 메타데이터 저장
            httpFileService.insertData(reqUserUid, oid, type, files, row, tempPartNo);
            return responseService.getSuccessResult();
        } catch (CRequiredException e) {
            return responseService.getFailResult( CRequiredException.getCode(), CRequiredException.getCustomMessage());
        } catch (CInvalidArgumentException e) {
            return responseService.getFailResult( CInvalidArgumentException.getCode(), CInvalidArgumentException.getCustomMessage());
        } catch (CInvalidPasswordException e) {
            return responseService.getFailResult( CInvalidPasswordException.getCode(), CInvalidPasswordException.getCustomMessage());
        } catch (Exception e) {
            return responseService.getFailResult(CUnknownException.getCode(), CUnknownException.getCustomMessage());
        }
    }

    @Operation(summary = "오픈이슈 코멘트 생성", description = "오픈이슈 코멘트 생성")
    @RequestMapping(value = "/comment/registration", method = RequestMethod.POST)
    public DataResult<OpenIssueComment> registrationOpenIssueComment(
            @Parameter(description = "코멘트", required = true) @RequestBody OpenIssueComment cond,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            OpenIssueComment resultSet = openIssueService.insertOpenIssueComment(cond, reqUserUid);
            return responseService.getDataResult(resultSet);
        } catch (CAlreadyExistException e) {
            return responseService.getDataResult(CAlreadyExistException.getCode(), CAlreadyExistException.getCustomMessage(),null);
        } catch (CRequiredException e) {
            return responseService.getDataResult(CRequiredException.getCode(), CRequiredException.getCustomMessage(),null);
        } catch (Exception e) {
            return responseService.getDataResult(CUnknownException.getCode(), CUnknownException.getCustomMessage(),null);
        }
    }

    @Operation(summary = "오픈이슈 코멘트 수정", description = "오픈이슈 코멘트 수정")
    @RequestMapping(value = "/comment/modify", method = RequestMethod.POST)
    public DataResult<OpenIssueComment> modifyOpenIssueComment(
            @Parameter(description = "코멘트", required = true) @RequestBody OpenIssueComment cond,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            OpenIssueComment resultSet = openIssueService.modifyOpenIssueComment(cond, reqUserUid);
            return responseService.getDataResult(resultSet);
        } catch (CAlreadyExistException e) {
            return responseService.getDataResult(CAlreadyExistException.getCode(), CAlreadyExistException.getCustomMessage(),null);
        } catch (CRequiredException e) {
            return responseService.getDataResult(CRequiredException.getCode(), CRequiredException.getCustomMessage(),null);
        } catch (Exception e) {
            return responseService.getDataResult(CUnknownException.getCode(), CUnknownException.getCustomMessage(),null);
        }
    }

    @Operation(summary = "오픈이슈 코멘트 목록", description = "오픈이슈 코멘트 목록")
    @RequestMapping(value = "/comment/{openIssueOid}", method = RequestMethod.GET)
    public ListResult<OpenIssueComment> findOpenIssueCommentList(
            @Parameter(description = "오픈이슈 키", required = true) @PathVariable Integer openIssueOid
    )
    {
        try {
            OpenIssueComment cond = new OpenIssueComment();
            cond.setOpenIssueOid(openIssueOid);
            return responseService.getListResult(openIssueService.findOpenIssueCommentList(cond));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 코멘트 검색실패");
        }
    }

    @Operation(summary = "오픈이슈 코멘트 상세", description = "오픈이슈 코멘트 상세")
    @RequestMapping(value = "/comment/{openIssueOid}/{oid}", method = RequestMethod.GET)
    public DataResult<OpenIssueComment> findOpenIssueComment(
            @Parameter(description = "오픈이슈 키", required = true) @PathVariable Integer openIssueOid,
            @Parameter(description = "OID", required = true) @PathVariable Integer oid
    )
    {
        try {
            OpenIssueComment cond = new OpenIssueComment();
            cond.setOid(oid);
            return responseService.getDataResult(openIssueService.findOpenIssueComment(cond));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 코멘트 검색실패");
        }
    }

    @Operation(summary = "오픈이슈 코멘트 삭제", description = "오픈이슈 코멘트 삭제")
    @RequestMapping(value = "/comment/remove/{oid}", method = RequestMethod.POST)
    public DataResult<Integer> removeOpenIssueComment(
            @Parameter(description = "OID", required = true) @PathVariable Integer oid
    )
    {
        try {
            return responseService.getDataResult(openIssueService.removeOpenIssueComment(oid));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 코멘트 삭제실패");
        }
    }

    @Operation(summary = "오픈이슈 그룹 카테고리 리스트 검색", description = "오픈이슈 그룹 카테고리 리스트 검색")
    @RequestMapping(value = "/group/category/{openIssueCategoryOid}", method = RequestMethod.GET)
    public ListResult<OpenIssueGroupCategory> findOpenIssueCategoryList(
            @Parameter(description = "오픈이슈그룹 카테고리 키", required = true) @PathVariable Integer openIssueCategoryOid,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            OpenIssueGroupCategory cond = new OpenIssueGroupCategory();
            cond.setOpenIssueGroupCategoryOid(openIssueCategoryOid);
            return responseService.getListResult(openIssueService.findOpenIssueCategoryList(cond));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 그룹 카테고리 리스트 검색");
        }
    }

    @Operation(summary = "오픈이슈 그룹 카테고리 리스트 추가,수정,삭제", description = "오픈이슈 코멘트 추가,수정,삭제")
    @RequestMapping(value = "/group/category/save", method = RequestMethod.POST)
    public ListResult<OpenIssueGroupCategory> saveOpenIssueCategory(
            @Parameter(description = "오픈이슈그룹 카테고리", required = true) @RequestBody List<OpenIssueGroupCategory> cond,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            openIssueService.saveOpenIssueCategory(cond, reqUserUid);
            return responseService.getListResult(cond);
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("오픈이슈 그룹 카테고리 리스트 추가,수정,삭제");
        }
    }
}
