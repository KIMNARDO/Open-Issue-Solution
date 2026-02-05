package com.papsnet.openissue.biz.salesOrder.controller;

import com.papsnet.openissue.biz.project.dto.PmsProject;
import com.papsnet.openissue.biz.salesOrder.dto.SalesOrder;
import com.papsnet.openissue.biz.salesOrder.service.SalesOrderService;
import com.papsnet.openissue.common.constant.SalesOrderConstant;
import com.papsnet.openissue.common.dto.DataResult;
import com.papsnet.openissue.common.dto.ListResult;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "영업 수주 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/salesOrder")
public class SalesOrderController {
    private final SalesOrderService salesOrderService;
    private final ResponseService responseService;

    @Operation(summary = "수주 목록 조회", description = "수주 목록 조회")
    @RequestMapping(value = "", method = RequestMethod.GET)
    public ListResult<SalesOrder> findSalesOrders(
            @Parameter(description = "정보", required = true) @ParameterObject SalesOrder cond
    ) {
        try {
            cond.setType(SalesOrderConstant.TYPE_SALESORDER);
            List<SalesOrder> result =  salesOrderService.findSalesOrders(cond);
            return responseService.getListResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("수주 검색 실패");
        }
    }

    @Operation(summary = "수주 단건 조회", description = "수주 단건 조회")
    @RequestMapping(value = "/byId", method = RequestMethod.GET)
    public DataResult<SalesOrder> findSalesOrder(
        @Parameter(description = "정보", required = true) @ParameterObject SalesOrder cond
    ) {
        try {
            cond.setType(SalesOrderConstant.TYPE_SALESORDER);

            SalesOrder result =  salesOrderService.findSalesOrder(cond);
            return responseService.getDataResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("수주 검색 실패");
        }
    }

    @Operation(summary = "PM 업데이트", description = "PJ_NO 기준으로 IF_RECV_BUSINESS_STATUS의 PM/PM_NM을 업데이트")
    @PatchMapping("/pm")
    public DataResult<Integer> updatePm(@RequestBody SalesOrder body) {
        try {
            int result = salesOrderService.updateSalesOrderProjectManager(body);
            return responseService.getDataResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("PM 업데이트 실패");
        }
    }

    @Operation(summary = "비고/대표견적 업데이트", description = "IF_KEY 기준으로 인터페이스 테이블 REMARK/REP_ESTIMATE 업데이트")
    @PatchMapping("/remark")
    public DataResult<Integer> updateRemarkAndRep(@RequestBody SalesOrder body) {
        try {
            int result = salesOrderService.updateRemarkAndRep(body);
            return responseService.getDataResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("비고/대표값 업데이트 실패");
        }
    }

    @Operation(summary = "Rep 설정 업데이트", description = "T_DSALESORDER의 REP 컬럼 업데이트")
    @PatchMapping("/rep")
    public DataResult<Integer> updateRep(@RequestBody SalesOrder body) {
        try {
            int result = salesOrderService.updateRepSetting(body);
            return responseService.getDataResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("REP 업데이트 실패");
        }
    }

    @Operation(summary = "PLM 수주 등록", description = "T_DSALESORDER에 PLM 수주 등록")
    @PostMapping("/plm")
    public DataResult<Integer> insertPlm(@RequestBody SalesOrder body) {
        try {
            int result = salesOrderService.insertPlmSalesOrder(body);
            return responseService.getDataResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("PLM 수주 등록 실패");
        }
    }

    @Operation(summary = "PLM 수주 수정", description = "템플릿 포함 여부에 따라 T_DSALESORDER 업데이트")
    @PutMapping("/plm")
    public DataResult<Integer> updatePlm(@RequestBody SalesOrder body) {
        try {
            int result = salesOrderService.updatePlmSalesOrder(body);
            return responseService.getDataResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("PLM 수주 수정 실패");
        }
    }

    @Operation(summary = "PLM 수주 단건 조회", description = "조건으로 PLM 수주 단건 조회")
    @GetMapping("/plm")
    public DataResult<SalesOrder> getPlm(@ParameterObject SalesOrder cond) {
        try {
            cond.setType(SalesOrderConstant.TYPE_SALESORDER);
            SalesOrder result = salesOrderService.findPlmSalesOrder(cond);
            return responseService.getDataResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("PLM 수주 조회 실패");
        }
    }

    @Operation(summary = "수주 일시중지", description = "DObject의 BPolicy를 Paused로 변경")
    @PatchMapping("/pause")
    public DataResult<Integer> pause(@RequestBody PmsProject body) {
        try {
            int result = salesOrderService.pauseSalesOrder(body);
            return responseService.getDataResult(result);
        } catch (Exception e) {
            throw new CBizProcessFailException("수주 일시중지 실패");
        }
    }
}
