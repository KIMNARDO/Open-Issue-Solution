package com.papsnet.openissue.common.controller;

import com.papsnet.openissue.common.dto.*;
import com.papsnet.openissue.common.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/common")
@RequiredArgsConstructor
@Tag(name = "Common", description = "공통 컨트롤러: Approval/Step/Task/Comment API")
public class CommonController {

    private final ResponseService responseService;
    private final ApprovalService approvalService;
    private final ApprovalStepService approvalStepService;
    private final ApprovalTaskService approvalTaskService;
    private final ApprovalCommentService approvalCommentService;
    private final ImageService imageService;

    // region Approval
    @Operation(summary = "승인 목록(비보강)")
    @PostMapping("/approval/sel-nonstep")
    public ListResult<Approval> SelApprovalsNonStep(
            @RequestBody Approval param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalService.SelApprovalsNonStep(param));
    }

    @Operation(summary = "승인 단건(비보강)")
    @PostMapping("/approval/object-nonstep")
    public DataResult<Approval> SelApprovalNonStep(
            @RequestBody Approval param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getDataResult(approvalService.SelApprovalNonStep(param));
    }

    @Operation(summary = "승인 저장 목록(비보강, 생성자 필터)")
    @PostMapping("/approval/saved-nonstep")
    public ListResult<Approval> SelSaveApprovalsNonStep(
            @RequestBody Approval param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalService.SelSaveApprovalsNonStep(reqUserUid, param));
    }

    @Operation(summary = "승인 단건(스텝/코멘트 포함)")
    @PostMapping("/approval/object")
    public DataResult<Approval> SelApproval(
            @RequestBody Approval param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getDataResult(approvalService.SelApproval(reqUserUid, param));
    }

    @Operation(summary = "승인 목록(스텝/코멘트 포함)")
    @PostMapping("/approval/list")
    public ListResult<Approval> SelApprovals(
            @RequestBody Approval param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalService.SelApprovals(reqUserUid, param));
    }

    @Operation(summary = "내 결재중/완료 목록(Approval)")
    @PostMapping("/approval/inbox/mypay")
    public ListResult<Approval> SelInboxMyPay(
            @RequestBody ApprovalTask param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalService.SelInboxMyPay(reqUserUid, param));
    }

    @Operation(summary = "승인 등록")
    @PostMapping("/approval/insert")
    public CommonResult InsApproval(
            @RequestBody Approval param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        approvalService.InsApproval(param);
        return responseService.getSuccessResult();
    }

    @Operation(summary = "승인 수정")
    @PostMapping("/approval/update")
    public CommonResult UdtApproval(
            @RequestBody Approval param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        approvalService.UdtApproval(param);
        return responseService.getSuccessResult();
    }
    @Operation(summary = "승인 히스토리 조회", description = "TargetOID 기준으로 승인 이력(작업 목록) 조회")
    @PostMapping("/approval/history")
    public ListResult<ApprovalTask> SelApprovalHistory(
            @RequestBody DObject param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalService.SelApprovalHistory(param));
    }
    // endregion

    // region ApprovalStep
    @Operation(summary = "승인 스텝 목록")
    @PostMapping("/approvalStep/sel")
    public ListResult<ApprovalStep> SelApprovalSteps(
            @RequestBody ApprovalStep param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalStepService.SelApprovalSteps(param));
    }

    @Operation(summary = "승인 스텝 단건")
    @PostMapping("/approvalStep/object")
    public DataResult<ApprovalStep> SelApprovalStep(
            @RequestBody ApprovalStep param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getDataResult(approvalStepService.SelApprovalStep(param));
    }

    @Operation(summary = "승인 스텝 등록")
    @PostMapping("/approvalStep/insert")
    public DataResult<Integer> InsApprovalStep(
        @RequestBody ApprovalStep param,
        @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        int result = approvalStepService.InsApprovalStep(param);
        return responseService.getDataResult(result);
    }
    // endregion

    // region ApprovalTask
    @Operation(summary = "승인 작업 조회")
    @PostMapping("/approvalTask/sel")
    public ListResult<ApprovalTask> SelInboxTasks(
            @RequestBody ApprovalTask param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalTaskService.SelInboxTasks(param));
    }

    @Operation(summary = "내 승인 작업 조회")
    @PostMapping("/approvalTask/mytasks")
    public ListResult<ApprovalTask> SelInboxMyTasks(
            @RequestBody ApprovalTask param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalTaskService.SelInboxMyTasks(reqUserUid, param));
    }

    @Operation(summary = "내 결재중/완료 작업 조회")
    @PostMapping("/approvalTask/mypaytasks")
    public ListResult<ApprovalTask> SelInboxMyPayTasks(
            @RequestBody ApprovalTask param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalTaskService.SelInboxMyPayTasks(reqUserUid, param));
    }

    @Operation(summary = "승인 작업 등록")
    @PostMapping("/approvalTask/insert")
    public CommonResult InsInboxTask(
            @RequestBody ApprovalTask param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        approvalTaskService.InsInboxTask(param);
        return responseService.getSuccessResult();
    }

    @Operation(summary = "승인 작업 수정")
    @PostMapping("/approvalTask/update")
    public CommonResult UdtInboxTask(
            @RequestBody ApprovalTask param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        approvalTaskService.UdtInboxTask(param);
        return responseService.getSuccessResult();
    }
    // endregion

    // region ApprovalComment
    @Operation(summary = "승인 코멘트 조회")
    @PostMapping("/approvalComment/sel")
    public ListResult<ApprovalComment> SelApprovalComment(
            @RequestBody ApprovalComment param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        return responseService.getListResult(approvalCommentService.SelApprovalComment(reqUserUid, param));
    }

    @Operation(summary = "승인 코멘트 등록")
    @PostMapping("/approvalComment/insert")
    public DataResult<Integer> InsApprovalComment(
            @RequestBody ApprovalComment param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        int result = approvalCommentService.InsApprovalComment(reqUserUid, param);
        return responseService.getDataResult(result);
    }

    @Operation(summary = "승인 코멘트 삭제")
    @PostMapping("/approvalComment/delete")
    public CommonResult DelApprovalComment(
            @RequestBody ApprovalComment param,
            @Parameter(description = "요청 사용자 UID", hidden = true) @RequestParam int reqUserUid
    ) {
        approvalCommentService.DelApprovalComment(reqUserUid, param);
        return responseService.getSuccessResult();
    }
    // endregion

    // region Image
    @Operation(summary = "이미지 업로드(썸네일)", description = "이미지 파일을 업로드하고 파일명을 반환합니다. OID가 전달되면 해당 DObject의 Thumbnail을 갱신합니다.")
    @PostMapping(value = "/image/upload", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public DataResult<String> ImgUploadFile(
            @RequestParam(value = "OID", required = false) String OID,
            @RequestPart("file") MultipartFile file
    ) {
        try {
            String fileName = imageService.uploadThumbnail(OID, file);
            return responseService.getDataResult(fileName);
        } catch (Exception ex) {
            return responseService.getFailResult(-1, ex.getMessage(), (String) null);
        }
    }
    // endregion

}
