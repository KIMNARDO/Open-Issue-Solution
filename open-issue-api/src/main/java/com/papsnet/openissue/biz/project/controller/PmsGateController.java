package com.papsnet.openissue.biz.project.controller;

import com.papsnet.openissue.biz.project.dto.PmsGateMetting;
import com.papsnet.openissue.biz.project.dto.PmsGateSignOff;
import com.papsnet.openissue.biz.project.dto.PmsGateSignOffCost;
import com.papsnet.openissue.biz.project.service.PmsGateService;
import com.papsnet.openissue.common.dto.DataResult;
import com.papsnet.openissue.common.dto.ListResult;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "Gate Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/pms/gate")
public class PmsGateController {
    private final PmsGateService service;
    private final ResponseService responseService;

    // Metting
    @PostMapping("/metting/list")
    public ListResult<PmsGateMetting> selPmsGateMetting(@RequestBody PmsGateMetting param) {
        try {
            return responseService.getListResult(service.selPmsGateMetting(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Gate Metting 검색 실패");
        }
    }

    @PostMapping("/metting/object")
    public DataResult<PmsGateMetting> selPmsGateMettingObject(@RequestBody PmsGateMetting param) {
        try {
            return responseService.getDataResult(service.selPmsGateMettingObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Gate Metting 조회 실패");
        }
    }

    // SignOff
    @PostMapping("/signoff/object")
    public DataResult<PmsGateSignOff> selPmsGateSignOff(@RequestBody PmsGateSignOff param) {
        try {
            return responseService.getDataResult(service.selPmsGateSignOff(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Gate SignOff 조회 실패");
        }
    }

    @PostMapping("/signoff/update")
    public DataResult<PmsGateSignOff> udtPmsGateSignOff(@RequestBody PmsGateSignOff param) {
        try {
            return responseService.getDataResult(service.udtPmsGateSignOff(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Gate SignOff 수정 실패");
        }
    }

    // SignOff Cost
    @PostMapping("/signoff/cost/insert")
    public DataResult<Integer> insPmsGateSignOffCost(@RequestBody PmsGateSignOffCost param) {
        try {
            return responseService.getDataResult(service.insPmsGateSignOffCost(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Gate SignOff Cost 저장 실패");
        }
    }

    @PostMapping("/signoff/cost/list")
    public ListResult<PmsGateSignOffCost> selPmsGateSignOffCost(@RequestBody PmsGateSignOffCost param) {
        try {
            return responseService.getListResult(service.selPmsGateSignOffCost(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Gate SignOff Cost 검색 실패");
        }
    }

    @PostMapping("/signoff/cost/object")
    public DataResult<PmsGateSignOffCost> selPmsGateSignOffCostObject(@RequestBody PmsGateSignOffCost param) {
        try {
            return responseService.getDataResult(service.selPmsGateSignOffCostObject(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Gate SignOff Cost 조회 실패");
        }
    }

    @PostMapping("/signoff/cost/delete")
    public DataResult<Integer> delPmsGateSignOffCost(@RequestBody PmsGateSignOffCost param) {
        try {
            return responseService.getDataResult(service.delPmsGateSignOffCost(param));
        } catch (Exception e) {
            throw new CBizProcessFailException("Gate SignOff Cost 삭제 실패");
        }
    }
}
