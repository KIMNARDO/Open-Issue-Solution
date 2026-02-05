package com.papsnet.openissue.auth.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.dto.User;
import com.papsnet.openissue.auth.provider.JwtProvider;
import com.papsnet.openissue.common.dto.CommonResult;
import com.papsnet.openissue.http.RequestWrapper;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.IOException;

/* 토큰 인증 담당 */
@Slf4j
public class JwtAuthenticationFilter extends GenericFilter {
    private JwtProvider jwtProvider;

    public JwtAuthenticationFilter(JwtProvider jwtProvider) {
        log.info("👉 [JwtAuthenticationFilter]");
        this.jwtProvider = jwtProvider;
    }

    /**
     * Request Header에서 토큰 정보 추출
     * @param request
     * @return
     */
    private String getToken(HttpServletRequest request) {
        log.info("👉 [JwtAuthenticationFilter] getToken");

        String token = request.getHeader(JwtProvider.ACCESS_HEADER_STRING);
        if (StringUtils.isNotBlank(token) && token.startsWith(JwtProvider.ACCESS_PREFIX_STRING)) {
            return token.substring(7);
        }

        return null;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        log.info("👉 [JwtAuthenticationFilter] doFilter");

        String token = getToken((HttpServletRequest)request);
        if (StringUtils.isNotBlank(token) && jwtProvider.validationToken(token)) {
            Authentication authentication = jwtProvider.getAuthentication(token);
            Person user = jwtProvider.getUserInfo(token);
            if ((authentication == null) || (user == null)) {
                SecurityContextHolder.clearContext();
                setErrorResponse((HttpServletResponse) response);
            } else {
                SecurityContextHolder.getContext().setAuthentication(authentication);
                RequestWrapper wrapper = new RequestWrapper((HttpServletRequest) request);
                wrapper.setRequestAdditionalUserInfo(user);
                chain.doFilter(wrapper, response);
            }
        } else {
            setErrorResponse((HttpServletResponse) response);
        }
    }

    private void setErrorResponse(HttpServletResponse response) throws IOException {
        log.info("👉 [JwtAuthenticationFilter] setErrorResponse");
        CommonResult commonResult = new CommonResult();
        commonResult.setType("error");
        commonResult.setCode(-1);
        commonResult.setMessage("인증 토큰이 유효하지 않습니다.");

        ObjectMapper objectMapper = new ObjectMapper();
        String rs = objectMapper.writeValueAsString(commonResult);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(rs);
    }
}
