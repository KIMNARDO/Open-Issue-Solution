package com.papsnet.openissue.auth.provider;

import com.papsnet.openissue.auth.dto.PrincipalDetails;
import com.papsnet.openissue.auth.service.PrincipalDetailsService;
import com.papsnet.openissue.util.EDecode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsChecker;
import org.springframework.stereotype.Component;

import java.security.DigestException;

@Slf4j
@Component
@RequiredArgsConstructor
public class GwAuthenticationProvider implements AuthenticationProvider {

    private final PrincipalDetailsService principalDetailsService;
    private UserDetailsChecker preAuthenticationChecks = new PreAuthenticationChecks();


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        log.info("👉 [GwAuthenticationProvider] authenticate");
        String username = (String) authentication.getPrincipal();   // 사용자 ID
        String password = (String) authentication.getCredentials();   // 암호

        // 사전 체크
        PrincipalDetails user = principalDetailsService.loadUserByUsername(username);

        if(user == null) throw new BadCredentialsException("해당 사용자를 찾을 수 없습니다");


        try {
            this.preAuthenticationChecks.check(user);
        } catch (AuthenticationException ex) {
            throw ex;
        }

        log.info("👉 [GrAuthenticationProvider] 사용자 암호 확인");
        UsernamePasswordAuthenticationToken authenticationToken
                = new UsernamePasswordAuthenticationToken(username, user.getPassword(), user.getAuthorities());
        authenticationToken.setDetails(user);
        return authenticationToken;
    }


    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.isAssignableFrom(UsernamePasswordAuthenticationToken.class);
    }

    private class PreAuthenticationChecks implements UserDetailsChecker {

        @Override
        public void check(UserDetails user) {
            if (!user.isAccountNonLocked()) {
                throw new LockedException("User account is locked");
            }
            if (!user.isEnabled()) {
                throw new DisabledException("User is disabled");
            }
            if (!user.isAccountNonExpired()) {
                throw new AccountExpiredException("User account has expired");
            }

        }
    }
}
