package com.papsnet.openissue.common.controller;

import com.papsnet.openissue.common.dto.*;
import com.papsnet.openissue.common.exception.CAlreadyExistException;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.exception.CRequiredException;
import com.papsnet.openissue.common.exception.CUnknownException;
import com.papsnet.openissue.common.service.DLibraryService;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@Tag(name = "라이브러리 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/library")
public class LibraryController {
    private final ResponseService responseService;
    private final DLibraryService dLibraryService;

    @Operation(summary = "세션 라이브러리 조회", description = "세션에 필요한 라이브러리 묶음 조회")
    @GetMapping("")
    public DataResult<Map<String, List<DLibrary>>> selSessionLibraries(@Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid) {
        try {
            return responseService.getDataResult(dLibraryService.selSessionLibraries());
        } catch (Exception e) {
            throw new CBizProcessFailException("라이브러리 검색 실패");
        }
    }

    @Operation(summary = "라이브러리 수정(키)")
    @RequestMapping(value = "/modify", method = {RequestMethod.POST})
    public CommonResult modifyLibrary(
            @Parameter(description = "정보", required = true) @RequestBody DLibrary data,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            data.setModifyUs(reqUserUid);
            DLibrary resultSet = dLibraryService.modifyLibrary(data);
            return responseService.getSuccessResult();
        } catch (CAlreadyExistException e) {
            return responseService.getDataResult(CAlreadyExistException.getCode(), CAlreadyExistException.getCustomMessage(),null);
        } catch (CRequiredException e) {
            return responseService.getDataResult(CRequiredException.getCode(), CRequiredException.getCustomMessage(),null);
        } catch (Exception e) {
            return responseService.getDataResult(CUnknownException.getCode(), CUnknownException.getCustomMessage(),null);
        }
    }

    @Operation(summary = "라이브러리 코드를 보내주면 하위 리스트 출력(오픈이슈용)", description = "라이브러리 코드를 보내주면 하위 리스트 출력")
    @RequestMapping(value = "/code/child/list/{code}", method = RequestMethod.GET)
    public ListResult<DLibrary> selChildLibraries(
            @Parameter(description = "code", required = true) @PathVariable String code,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    )
    {
        try {
            return responseService.getListResult(dLibraryService.selChildLibraries(code));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("라이브러리 검색실패");
        }
    }

    // region Library (DObject + DLibrary)
    @Operation(summary = "라이브러리 조회", description = "라이브러리 목록 조회")
    @PostMapping("/sel")
    public ListResult<DLibrary> SelLibrary(@RequestBody DLibrary param, @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid) {
        try {
            return responseService.getListResult(dLibraryService.SelLibrary(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("라이브러리 검색 실패");
        }
    }

    @Operation(summary = "라이브러리 전체 조회", description = "라이브러리 전체 목록 조회")
    @PostMapping("/all")
    public ListResult<DLibrary> AllSelLibrary(
            @RequestBody DLibrary param,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            return responseService.getListResult(dLibraryService.AllSelLibrary(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("라이브러리 전체 검색 실패");
        }
    }

    @Operation(summary = "라이브러리 단건 조회", description = "라이브러리 단건 조회")
    @PostMapping("/object")
    public DataResult<DLibrary> SelLibraryObject(
            @RequestBody DLibrary param,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            return responseService.getDataResult(dLibraryService.SelLibraryObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("라이브러리 단건 검색 실패");
        }
    }

    @Operation(summary = "라이브러리 수정", description = "라이브러리 정보 수정")
    @PostMapping("/update")
    public CommonResult updateLibrary(
            @RequestBody DLibrary data,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            data.setModifyUs(reqUserUid);
            dLibraryService.modifyLibrary(data);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            throw new CBizProcessFailException("라이브러리 수정 실패");
        }
    }

    @Operation(summary = "라이브러리 등록", description = "라이브러리 신규 등록")
    @PostMapping("/insert")
    public DataResult<Integer> InsertLibrary(
            @RequestBody DLibrary data,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            data.setCreateUs(reqUserUid);
            Integer oid = dLibraryService.insertLibrary(data);
            return responseService.getDataResult(oid);
        } catch (Exception e) {
            throw new CBizProcessFailException("라이브러리 등록 실패");
        }
    }

    @Operation(summary = "라이브러리 삭제", description = "라이브러리 삭제")
    @PostMapping("/delete")
    public CommonResult delLibrary(
            @RequestBody DLibrary data,
            @Parameter(hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            data.setDeleteUs(reqUserUid);
            dLibraryService.delLibrary(data);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            throw new CBizProcessFailException("라이브러리 삭제 실패");
        }
    }
    // endregion

    // region CodeLibrary
    @Operation(summary = "코드 라이브러리 조회", description = "코드 라이브러리 목록 조회")
    @PostMapping("/code/sel")
    public ListResult<DLibrary> SelCodeLibrary(@RequestBody DLibrary param, @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid) {
        try {
            return responseService.getListResult(dLibraryService.SelCodeLibrary(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("코드 라이브러리 검색 실패");
        }
    }

    @Operation(summary = "코드 라이브러리 전체 조회", description = "코드 라이브러리 전체 목록 조회")
    @PostMapping("/code/all")
    public ListResult<DLibrary> AllSelCodeLibrary(@RequestBody DLibrary param, @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid) {
        try {
            return responseService.getListResult(dLibraryService.AllSelCodeLibrary(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("코드 라이브러리 전체 검색 실패");
        }
    }

    @Operation(summary = "코드 라이브러리 하위 조회", description = "코드 라이브러리 하위 목록 조회")
    @PostMapping("/code/child")
    public ListResult<DLibrary> SelCodeLibraryChild(@RequestBody DLibrary param, @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid) {
        try {
            return responseService.getListResult(dLibraryService.SelCodeLibraryChild(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("코드 라이브러리 하위 검색 실패");
        }
    }

    @Operation(summary = "코드 라이브러리 단건 조회", description = "코드 라이브러리 단건 조회")
    @PostMapping("/code/object")
    public DataResult<DLibrary> SelCodeLibraryObject(@RequestBody DLibrary param, @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid) {
        try {
            return responseService.getDataResult(dLibraryService.SelCodeLibraryObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("코드 라이브러리 단건 검색 실패");
        }
    }

    @Operation(summary = "코드 라이브러리 등록", description = "코드 라이브러리 신규 등록")
    @PostMapping("/code/insert")
    public CommonResult InsertCodeLibrary(@RequestBody DLibrary data, @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid) {
        try {
            data.setCreateUs(reqUserUid);
            dLibraryService.insertCodeLibrary(data);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            throw new CBizProcessFailException("코드 라이브러리 등록 실패");
        }
    }

    @Operation(summary = "코드 라이브러리 삭제", description = "코드 라이브러리 삭제")
    @PostMapping("/code/delete")
    public CommonResult delCodeLibrary(@RequestBody DLibrary data, @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid) {
        try {
            data.setDeleteUs(reqUserUid);
            dLibraryService.deleteCodeLibrary(data);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            throw new CBizProcessFailException("코드 라이브러리 삭제 실패");
        }
    }

    @Operation(summary = "코드 라이브러리 수정", description = "코드 라이브러리 정보 수정")
    @PostMapping("/code/update")
    public CommonResult updateCodeLibrary(@RequestBody DLibrary data, @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid) {
        try {
            dLibraryService.updateCodeLibrary(data);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            throw new CBizProcessFailException("코드 라이브러리 수정 실패");
        }
    }
    // endregion

    // region AssessListLibrary
    @Operation(summary = "영향성 평가표 목록 조회", description = "영향성 평가표 최신 버전 목록 조회 및 하위 항목 포함")
    @GetMapping("/assess/list")
    public ListResult<DLibrary> SelAssessLibrary(
            @RequestParam(required = false) Integer oid,
            @RequestParam(required = false) String name,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        try {
            DLibrary cond = new DLibrary();
            cond.setOid(oid);
            cond.setName(name);

            List<DLibrary> parents = dLibraryService.SelAssessLibraryLatest(cond);
            for (DLibrary p : parents) {
                List<DLibrary> child = dLibraryService.SelAssessLibraryChild(DLibrary.builder().fromOID(p.getOid()).build());
                p.setCData(child);
            }
            return responseService.getListResult(parents);
        } catch (Exception e) {
            throw new CBizProcessFailException("영향성 평가표 검색 실패");
        }
    }

    @Operation(summary = "영향성 평가표 수정", description = "영향성 평가표 순서/리비전/삭제 등 변경 처리")
    @PostMapping("/assess/update")
    public DataResult<Integer> updateAssessLibrary(@RequestBody List<DLibrary> data,
                                                   @RequestParam int reqUserUid) {
        try {
            int result = dLibraryService.updateAssessLibrary(data, reqUserUid);
            return responseService.getDataResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("영향성 평가표 수정 실패");
        }
    }
    // endregion
}
