package com.papsnet.openissue.common.controller;

import com.papsnet.openissue.common.dto.*;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.service.DocumentClassificationService;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "문서 분류 체계 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/documentClassification")
public class DocumentClassificationController {
    private final ResponseService responseService;
    private final DocumentClassificationService documentClassificationService;

    // region Document Classification
    @Operation(summary = "문서 분류 체계 조회", description = "문서 분류 체계 목록 조회")
    @PostMapping("/sel")
    public ListResult<DocClass> SelDocumentClassification(@RequestBody DocClass param) {
        try {
            return responseService.getListResult(documentClassificationService.SelDocClass(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("문서 분류 체계 검색 실패");
        }
    }

    @Operation(summary = "문서 분류 체계 전체 조회", description = "문서 분류 체계 전체 목록 조회")
    @PostMapping("/all")
    public ListResult<DocClass> AllSelDocumentClassification(@RequestBody DocClass param) {
        try {
            return responseService.getListResult(documentClassificationService.AllSelDocClass(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("문서 분류 체계 전체 검색 실패");
        }
    }

    @Operation(summary = "문서 분류 체계 트리 조회", description = "문서 분류 체계 전체 트리 조회")
    @GetMapping("/tree/{rootOid}")
    public ListResult<DocClass> SelDocumentClassificationTree(@PathVariable("rootOid") Integer rootOid) {
        try {
            return responseService.getListResult(documentClassificationService.selDocClassTree(rootOid));
        } catch (Exception e) {
            throw new CBizProcessFailException("문서 분류 체계 전체 검색 실패");
        }
    }

    @Operation(summary = "문서 분류 체계 단건 조회", description = "문서 분류 체계 단건 조회")
    @PostMapping("/object")
    public DataResult<DocClass> SelDocumentClassificationObject(@RequestBody DocClass param) {
        try {
            return responseService.getDataResult(documentClassificationService.SelDocClassObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("문서 분류 체계 단건 검색 실패");
        }
    }

    @Operation(summary = "문서 분류 체계 등록", description = "문서 분류 체계 신규 등록")
    @PostMapping("/insert")
    public DataResult<Integer> InsDocumentClassification(@RequestBody DocClass data, @RequestParam int reqUserUid) {
        try {
            data.setCreateUs(reqUserUid);
            Integer oid = documentClassificationService.insertDocClass(data);
            return responseService.getDataResult(oid);
        } catch (Exception e) {
            throw new CBizProcessFailException("문서 분류 체계 등록 실패");
        }
    }

    @Operation(summary = "문서 분류 체계 수정", description = "문서 분류 체계 수정")
    @PostMapping("/update")
    public CommonResult UdtDocumentClassification(@RequestBody DocClass data, @RequestParam int reqUserUid) {
        try {
            data.setModifyUs(reqUserUid);
            documentClassificationService.updateDocClass(data);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            throw new CBizProcessFailException("문서 분류 체계 수정 실패");
        }
    }

    @Operation(summary = "문서 분류 체계 삭제", description = "문서 분류 체계 삭제")
    @PostMapping("/delete")
    public CommonResult DelDocumentClassification(@RequestBody DocClass data, @RequestParam int reqUserUid) {
        try {
            data.setDeleteUs(reqUserUid);
            documentClassificationService.deleteDocClass(data);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            throw new CBizProcessFailException("문서 분류 체계 삭제 실패");
        }
    }
    // endregion
}
