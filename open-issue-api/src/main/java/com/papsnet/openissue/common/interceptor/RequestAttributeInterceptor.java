package com.papsnet.openissue.common.interceptor;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.dto.User;
import com.papsnet.openissue.auth.provider.JwtProvider;
import com.papsnet.openissue.util.AppContant;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class RequestAttributeInterceptor implements HandlerInterceptor {
    private final JwtProvider jwtProvider;

    public RequestAttributeInterceptor(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        Person user = getUserFromToken(request);
        request.setAttribute(AppContant.REQ_PARAM_USER_UID, user.getOid());
//        request.setAttribute(AppContant.REQ_PARAM_USER_DEPT, user.getDepartmentCd());
        request.setAttribute(AppContant.REQ_PARAM_ACCOUNT_ID, user.getId());
        return true;
    }

    private Person getUserFromToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid Authorization header");
        }

        String token = header.substring(7);
        if (!jwtProvider.validationToken(token)) {
            throw new IllegalArgumentException("Invalid JWT token");
        }

        return jwtProvider.getUserInfo(token);
    }
}