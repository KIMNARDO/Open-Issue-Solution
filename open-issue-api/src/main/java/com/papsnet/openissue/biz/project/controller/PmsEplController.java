package com.papsnet.openissue.biz.project.controller;

import com.papsnet.openissue.biz.project.dto.PmsEPL;
import com.papsnet.openissue.biz.project.dto.PmsEPLItem;
import com.papsnet.openissue.biz.project.dto.PmsEPLSpec;
import com.papsnet.openissue.biz.project.service.PmsEplService;
import com.papsnet.openissue.common.dto.DataResult;
import com.papsnet.openissue.common.dto.ListResult;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "EPL Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pms/epl")
public class PmsEplController {
    private final PmsEplService service;
    private final ResponseService responseService;

    @Operation(summary = "EPL 목록 조회", description = "EPL 검색 조건으로 목록을 조회합니다.")
    @RequestMapping(value = "/list", method = {RequestMethod.POST})
    public ListResult<PmsEPL> selEPL(
            @RequestBody PmsEPL param
    ) {
        try {
            return responseService.getListResult(service.selEPL(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL 검색 실패");
        }
    }

    @Operation(summary = "EPL 단건 조회", description = "EPL OID 등으로 단건 정보를 조회합니다.")
    @RequestMapping(value = "/object", method = {RequestMethod.POST})
    public DataResult<PmsEPL> selEPLObject(
            @RequestBody PmsEPL param
    ) {
        try {
            return responseService.getDataResult(service.selEPLObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL 조회 실패");
        }
    }

    @Operation(summary = "EPL 생성", description = "EPL을 생성합니다. 본문에 EPL 정보를 전달하세요.")
    @RequestMapping(value = "/insert", method = {RequestMethod.POST})
    public DataResult<Integer> insEPL(
            @RequestBody PmsEPL param
    ) {
        try {
            return responseService.getDataResult(service.insEPL(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL 저장 실패");
        }
    }

    @Operation(summary = "EPL 수정", description = "EPL 정보를 수정합니다.")
    @RequestMapping(value = "/update", method = {RequestMethod.POST})
    public DataResult<Integer> udtEPL(
            @RequestBody PmsEPL param
    ) {
        try {
            return responseService.getDataResult(service.udtEPL(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL 수정 실패");
        }
    }

    // Items
    @Operation(summary = "EPL Item 목록 조회", description = "EPL Item 조건으로 목록을 조회합니다.")
    @RequestMapping(value = "/item/list", method = {RequestMethod.POST})
    public ListResult<PmsEPLItem> selEPLItem(
            @RequestBody PmsEPLItem param
    ) {
        try {
            return responseService.getListResult(service.selEPLItem(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL Item 검색 실패");
        }
    }

    @Operation(summary = "EPL Item 단건 조회", description = "EPL Item OID 등으로 단건 정보를 조회합니다.")
    @RequestMapping(value = "/item/object", method = {RequestMethod.POST})
    public DataResult<PmsEPLItem> selEPLItemObject(
            @RequestBody PmsEPLItem param
    ) {
        try {
            return responseService.getDataResult(service.selEPLItemObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL Item 조회 실패");
        }
    }

    @PostMapping("/item/insert")
    public DataResult<Integer> insEPLItem(@RequestBody PmsEPLItem param) {
        try {
            return responseService.getDataResult(service.insEPLItem(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL Item 저장 실패");
        }
    }

    @PostMapping("/item/update")
    public DataResult<Integer> udtEPLItem(@RequestBody PmsEPLItem param) {
        try {
            return responseService.getDataResult(service.udtEPLItem(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL Item 수정 실패");
        }
    }

    @PostMapping("/item/delete")
    public DataResult<Integer> delEPLItem(@RequestBody PmsEPLItem param) {
        try {
            return responseService.getDataResult(service.delEPLItem(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL Item 삭제 실패");
        }
    }

    // Spec
    @PostMapping("/spec/object")
    public DataResult<PmsEPLSpec> selEPLSpecObject(@RequestBody PmsEPLSpec param) {
        try {
            return responseService.getDataResult(service.selEPLSpecObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL Spec 조회 실패");
        }
    }

    @PostMapping("/spec/insert")
    public DataResult<Integer> insEPLSpec(@RequestBody PmsEPLSpec param) {
        try {
            return responseService.getDataResult(service.insEPLSpec(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL Spec 저장 실패");
        }
    }

    @PostMapping("/spec/update")
    public DataResult<Integer> udtEPLSpec(@RequestBody PmsEPLSpec param) {
        try {
            return responseService.getDataResult(service.udtEPLSpec(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("EPL Spec 수정 실패");
        }
    }
}
