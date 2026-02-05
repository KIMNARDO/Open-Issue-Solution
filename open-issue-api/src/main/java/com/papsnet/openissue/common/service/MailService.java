package com.papsnet.openissue.common.service;

import com.papsnet.openissue.common.config.MailProperties;
import com.papsnet.openissue.common.dto.MailRequest;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class MailService {
    private final JavaMailSender mailSender;
    private final MailProperties mailProperties;

    @Async
    public void send(@NonNull MailRequest req) {

        Boolean isDev = mailProperties.isDev();

        if (Boolean.TRUE.equals(isDev)) {
            log.info("[MAIL-DEV] 메일 전송 생략: to={}, name={}, subject={}, cc={}", req.getTo(), req.getName(), req.getSubject(), req.getCc());
            log.debug("[MAIL-DEV] body=\n{}", req.getBody());
            return;
        }

        try {
            var mimeMessage = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(mimeMessage, true, StandardCharsets.UTF_8.name());

            String fromAddress = Objects.requireNonNullElse(mailProperties.getFrom(), getDefaultFrom());
            String fromName = mailProperties.getFromName();
            helper.setFrom(new InternetAddress(fromAddress, fromName, StandardCharsets.UTF_8.name()));

            if (req.getName() != null && !req.getName().isBlank()) {
                helper.setTo(new InternetAddress(req.getTo(), req.getName(), StandardCharsets.UTF_8.name()));
            } else {
                helper.setTo(req.getTo());
            }

            if (req.getCc() != null && !req.getCc().isBlank()) {
                for (String cc : req.getCc().split(",")) {
                    String trimmed = cc.trim();
                    if (!trimmed.isEmpty()) helper.addCc(trimmed);
                }
            }

            helper.setSubject(req.getSubject());
            helper.setText(req.getBody(), true); // HTML

            mailSender.send(mimeMessage);
        } catch (MessagingException | MailException e) {
            log.error("메일 전송 실패: {}", e.getMessage(), e);
            throw new RuntimeException("메일 전송 중 오류가 발생했습니다.", e);
        } catch (Exception e) {
            log.error("메일 전송 일반 오류: {}", e.getMessage(), e);
            throw new RuntimeException("메일 전송 처리 중 오류가 발생했습니다.", e);
        }
    }

    private String getDefaultFrom() {
        // 대부분 spring.mail.username 이 발신 주소가 됨 (JavaMailSender 구현체에서 사용)
        // 별도 설정이 없다면 null 을 반환할 수 있으므로 호출부에서 Null 처리
        try {
            // JavaMailSenderImpl 에서 username 을 꺼낼 수 있는지 시도
            var implClass = mailSender.getClass().getName();
            if (implClass.endsWith("JavaMailSenderImpl")) {
                var usernameField = mailSender.getClass().getDeclaredField("username");
                usernameField.setAccessible(true);
                Object username = usernameField.get(mailSender);
                if (username != null) return username.toString();
            }
        } catch (Exception ignore) {
        }
        return null;
    }
}
