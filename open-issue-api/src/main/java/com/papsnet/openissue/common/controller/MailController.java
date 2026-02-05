package com.papsnet.openissue.common.controller;

import com.papsnet.openissue.common.dto.CommonResult;
import com.papsnet.openissue.common.dto.MailRequest;
import com.papsnet.openissue.common.service.MailService;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "메일 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/mail")
public class MailController {
    private final ResponseService responseService;
    private final MailService mailService;

    @Operation(summary = "메일 전송")
    @PostMapping("/send")
    public CommonResult sendMail(@RequestBody MailRequest request) {
        // 간단한 유효성 검사 (별도의 Validation 의존성 없이 처리)

//        request.setTo("cskim@papsnet.net");
//        request.setTo("ljd0703@woory.com");
//        request.setName("관리자");
//        request.setSubject("Test 제목");
//        request.setBody("Test 본문");
        //신규등록
        //상태값변경
        //의견추가

        //제목은 오픈이슈 신규등록, 오픈이슈 의견 작성
        //내용은 설명 전부
        //신규는 이슈를 보고있는 사람들 전부
        
        //의견등록 담당자와 작성자
        
        //상태값변경은 담당자와 작성자

        //파일 들어가있으면 문구나 색상 같은걸 초록으로 변경

        //의견은 달리면 체크 하고 체크했으면 생상제거


        if (request == null) {
            return responseService.getFailResult(-1, "요청 본문이 필요합니다.");
        }
        if (isBlank(request.getTo())) {
            return responseService.getFailResult(-1, "수신자 이메일(to)은 필수입니다.");
        }
        if (!isValidEmail(request.getTo())) {
            return responseService.getFailResult(-1, "수신자 이메일 형식이 올바르지 않습니다.");
        }
        if (isBlank(request.getSubject())) {
            return responseService.getFailResult(-1, "메일 제목(subject)은 필수입니다.");
        }
        if (isBlank(request.getBody())) {
            return responseService.getFailResult(-1, "메일 본문(body)은 필수입니다.");
        }

        try {
            mailService.send(request);
            return responseService.getSuccessResult();
        } catch (Exception e) {
            log.error("메일 전송 실패", e);
            return responseService.getFailResult(-1, "메일 전송 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    // 매우 단순한 형식 검증: 실제 RFC 검증 대신 기본적인 패턴만 체크
    private boolean isValidEmail(String email) {
        if (isBlank(email)) return false;
        if (email.contains(" ")) return false;
        int at = email.indexOf('@');
        int dot = email.lastIndexOf('.');
        return at > 0 && dot > at + 1 && dot < email.length() - 1;
    }
}
