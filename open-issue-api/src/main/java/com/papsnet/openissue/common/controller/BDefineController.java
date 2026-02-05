package com.papsnet.openissue.common.controller;

import com.papsnet.openissue.common.dto.Approval;
import com.papsnet.openissue.common.dto.BDefine;
import com.papsnet.openissue.common.dto.DataResult;
import com.papsnet.openissue.common.dto.ListResult;
import com.papsnet.openissue.common.service.BDefineService;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Tag(name = "BDEFINE 규칙 및 타입 정의 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/define")
public class BDefineController {
    private final ResponseService responseService;
    private final BDefineService bDefineService;

    @Operation(summary = "규칙 및 타입 정리 리스트", description = "규칙 및 타입 정리 리스트")
    @GetMapping("/list")
    public ListResult<BDefine> findBDefines(
            @Parameter(description = "이름", required = false) @RequestParam(required = false) String name,
            @Parameter(description = "타입", required = false) @RequestParam(required = false) String type,
            @Parameter(description = "모듈", required = false) @RequestParam(required = false) String module,
//            @Parameter(description = "순서", required = false) @RequestParam(required = false) Integer ord,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        BDefine cond = new BDefine();
        cond.setName(name);
        cond.setType(type);
        cond.setModule(module);
//        cond.setOrd(ord);

        List<BDefine> result = bDefineService.selBDefines(cond);
        return responseService.getListResult(result);
    }

    @Operation(summary = "규칙 및 타입 정리", description = "규칙 및 타입 정리")
    @GetMapping("/")
    public DataResult<BDefine> findBDefine(
            @Parameter(description = "키", required = false) @RequestParam(required = false) Integer oid,
            @Parameter(description = "이름", required = false) @RequestParam(required = false) String name,
            @Parameter(description = "타입", required = false) @RequestParam(required = false) String type,
            @Parameter(description = "모듈", required = false) @RequestParam(required = false) String module,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        BDefine cond = new BDefine();
        cond.setOid(oid);
        cond.setName(name);
        cond.setType(type);
        cond.setModule(module);

        BDefine result = bDefineService.selBDefine(cond);
        return responseService.getDataResult(result);
    }
}
