package com.papsnet.openissue.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MailRequest {
    private String to;          // 수신자 이메일
    private String name;        // 수신자 이름(옵션)
    private String subject;     // 제목
    private String body;        // 본문 (HTML 허용)
    private String cc;          // 참조(콤마 구분, 옵션)
}
