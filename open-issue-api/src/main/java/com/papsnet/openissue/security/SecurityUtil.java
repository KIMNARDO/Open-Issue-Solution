package com.papsnet.openissue.security;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.dto.PrincipalDetails;
import com.papsnet.openissue.auth.dto.User;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
@NoArgsConstructor
public class SecurityUtil {
    // Security Context 에 저장되어 있는 인증 객체 가져오기
    public static Person getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        PrincipalDetails principal = (PrincipalDetails) authentication.getPrincipal();
        Person user = principal.getUser();

        return user;
    }
}
