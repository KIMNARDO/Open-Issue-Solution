package com.papsnet.openissue.biz.project.controller;

import com.papsnet.openissue.biz.project.dto.PmsReliability;
import com.papsnet.openissue.biz.project.dto.PmsReliabilityReport;
import com.papsnet.openissue.biz.project.service.PmsReliabilityService;
import com.papsnet.openissue.common.dto.DataResult;
import com.papsnet.openissue.common.dto.ListResult;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Reliability Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pms/reliability")
public class PmsReliabilityController {
    private final PmsReliabilityService service;
    private final ResponseService responseService;

    // Reliability
    @PostMapping("/list")
    public ListResult<PmsReliability> selPmsReliability(@RequestBody PmsReliability param) {
        try {
            return responseService.getListResult(service.selPmsReliability(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Reliability 검색 실패");
        }
    }

    @PostMapping("/object")
    public DataResult<PmsReliability> selPmsReliabilityObject(@RequestBody PmsReliability param) {
        try {
            return responseService.getDataResult(service.selPmsReliabilityObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Reliability 조회 실패");
        }
    }

    @PostMapping("/insert")
    public DataResult<Integer> insPmsReliability(@RequestBody PmsReliability param) {
        try {
            return responseService.getDataResult(service.insPmsReliability(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Reliability 저장 실패");
        }
    }

    @PostMapping("/update")
    public DataResult<Integer> udtPmsReliability(@RequestBody PmsReliability param) {
        try {
            return responseService.getDataResult(service.udtPmsReliability(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Reliability 수정 실패");
        }
    }

    // Reports
    @PostMapping("/report/list")
    public ListResult<PmsReliabilityReport> selPmsReliabilityReport(@RequestBody PmsReliabilityReport param) {
        try {
            return responseService.getListResult(service.selPmsReliabilityReport(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Reliability Report 검색 실패");
        }
    }

    @PostMapping("/report/object")
    public DataResult<PmsReliabilityReport> selPmsReliabilityReportObject(@RequestBody PmsReliabilityReport param) {
        try {
            return responseService.getDataResult(service.selPmsReliabilityReportObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Reliability Report 조회 실패");
        }
    }

    @PostMapping("/report/insert")
    public DataResult<Integer> insPmsReliabilityReport(@RequestBody PmsReliabilityReport param) {
        try {
            return responseService.getDataResult(service.insPmsReliabilityReport(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Reliability Report 저장 실패");
        }
    }

    @PostMapping("/report/update")
    public DataResult<Integer> udtPmsReliabilityReport(@RequestBody PmsReliabilityReport param) {
        try {
            return responseService.getDataResult(service.udtPmsReliabilityReport(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Reliability Report 수정 실패");
        }
    }
}
