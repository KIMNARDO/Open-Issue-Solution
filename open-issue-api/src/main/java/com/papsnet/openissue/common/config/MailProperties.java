package com.papsnet.openissue.common.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.mail")
public class MailProperties {
    /**
     * 개발환경 여부. true이면 메일 전송을 실제로 하지 않음.
     */
    private boolean dev = false;

    /**
     * 기본 발신 이메일 주소 (생략 시 spring.mail.username 사용)
     */
    private String from;

    /**
     * 발신자 표시 이름
     */
    private String fromName = "PLM 시스템 관리자";

    /**
     * 테스트 수신자(옵션): dev=true인 경우, 실제 전송은 하지 않지만 로그에 이 주소와 내용을 출력
     */
    private String devTo;
}
