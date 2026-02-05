package com.papsnet.openissue.auth.handler;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.papsnet.openissue.auth.dto.JwtToken;
import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.dto.PrincipalDetails;
import com.papsnet.openissue.auth.dto.User;
import com.papsnet.openissue.auth.service.JwtService;
import com.papsnet.openissue.auth.service.PersonService;
import com.papsnet.openissue.auth.service.UserService;
import com.papsnet.openissue.common.dto.DataResult;
import com.papsnet.openissue.common.event.SamshinEventPublisher;
import com.papsnet.openissue.http.HttpReqRespUtils;
import com.papsnet.openissue.util.MessageUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/*
 * 로그인 인증 성공 핸들러
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LoginSuccessHandler implements AuthenticationSuccessHandler {
    private final JwtService jwtService;
    private final ObjectMapper objectMapper;
    private final PersonService personService;
    private final SamshinEventPublisher samshinEventPublisher;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        //1. 로그인 인증을 마친 사용자 가져오기
        Person user = ((PrincipalDetails)authentication.getDetails()).getUser();

        //2. 토큰 생성
        JwtToken jwtToken = jwtService.issueToken(user.getOid().longValue(), user.getId(), user.getName(), user.extractAuths());

        // 3. 인증 결과 반환
        user.setToken(jwtToken);

        // 4. 최근 로그인 기록
        personService.updateLastLoginDt(user);
        // samshinEventPublisher.publishLoginUser(user);

        DataResult<Person> resultData = new DataResult<>();
        resultData.setResult(user);
        resultData.setCode(0);
        resultData.setType("info");
        resultData.setMessage(MessageUtil.getMessage("msg.auth.success"));

        String res = objectMapper.writeValueAsString(resultData);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpStatus.OK.value());
        response.getWriter().write(res);
    }
}
