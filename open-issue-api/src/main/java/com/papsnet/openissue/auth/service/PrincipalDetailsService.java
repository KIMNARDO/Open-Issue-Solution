package com.papsnet.openissue.auth.service;

import com.papsnet.openissue.auth.dao.PersonDAO;
import com.papsnet.openissue.auth.dao.UserDAO;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.dto.PrincipalDetails;
import com.papsnet.openissue.auth.dto.User;
import com.papsnet.openissue.auth.dto.UserRole;
import com.papsnet.openissue.util.MessageUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PrincipalDetailsService implements UserDetailsService {
    private static final String ROLE_PREFIX = "ROLE_";

//    private final UserDAO userDAO;
    private final UserAndPersonService userAndPersonService;

    @Override
    public PrincipalDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        log.info("👉 [PrincipalDetailsService] loadUserByUsername");
        PrincipalDetails userDetails = new PrincipalDetails();
        // 사용자 정보 조회
        Person user = null;
        try {
            user = userAndPersonService.selectUserInfoByAccountId(username);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        if (user == null) {
            throw new UsernameNotFoundException(MessageUtil.getMessage("error.user.notfound", new String[]{username}));
        }

        userDetails.setUser(user);

        // 권한 정보 조회
        List<UserRole> roles = null;
//        try {
//            roles = userDAO.selectUserRoleById(username);
//            if (roles != null)  user.setAuthorities(roles);
//            userDetails.setUser(user);
//        } catch (Exception e) {
//            log.error("👉 [PrincipalDetailsService] role 정보조회 에러");
//            log.error(e.getMessage());
//        }

        // TODO 사용자 그룹 및 메뉴정보
        // TODO 계정 상태 정보 체크

        return userDetails;
    }
}
