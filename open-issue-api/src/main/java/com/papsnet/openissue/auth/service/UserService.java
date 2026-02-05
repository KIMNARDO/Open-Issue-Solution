package com.papsnet.openissue.auth.service;

import com.papsnet.openissue.auth.dao.UserDAO;
import com.papsnet.openissue.auth.dto.*;
import com.papsnet.openissue.common.dao.AppConfigDAO;
import com.papsnet.openissue.common.dao.BMenuDAO;
import com.papsnet.openissue.common.dto.BMenu;
import com.papsnet.openissue.common.exception.*;
import com.papsnet.openissue.common.service.AppConfigService;
import com.papsnet.openissue.util.AppContant;
import com.papsnet.openissue.util.CipherUtil;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;


@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {
    public enum UserType {
        PRIVATE("P"),          // 개인계정
        GENERAL("G"),          // 공용계정
        SYSTEM("S");           // 시스템계정

        String value;
        UserType(String value) { this.value = value; }

        public String getValue() { return this.value; }
    }

    private final UserDAO userDAO;
    private final AppConfigDAO appConfigDAO;
    private final SqlSessionFactory sqlSessionFactory;
    private final BMenuDAO bMenuDAO;

//    private final SamshinEventPublisher samshinEventPublisher;

    /**
     * 로그인 사용자 정보 등록
     * 외부사용자 등록 시 메일 / 핸드폰 정보를 협력사 마스터 정보에 전송
     * @param user
     * @return
     * @throws Exception
     */
    @CacheEvict(value="userInfo", allEntries = true)
    @Transactional
    public User createUser(User user, Long reqUserUid)
    {
        // 유효성 검사
        if (StringUtils.isBlank(user.getAccountId())) {
            throw new CRequiredException("사용자 ID는 필수항목입니다.");
        } else if (StringUtils.isBlank(user.getAccountPwd())) {
            throw new CRequiredException("암호는 필수항목입니다.");
        } else if (StringUtils.isBlank(user.getAccountName())) {
            throw new CRequiredException("사용자명은 필수항목입니다.");
        }
        user.setRegUid(reqUserUid);
        // 디폴트 값 설정
        user = configUserDefault(user);

        // 사용자 패스워드 암호화
        user.setAccountPwd(CipherUtil.sha512encrypt(user.getAccountPwd()));

        // 계정등록
        int insCount = 0;
        try {
            // 1. 사용자 등록

            // 사용자 등록
            insCount = userDAO.insertUser(user);

            if (insCount == 1)
            {
//                samshinEventPublisher.publishRegisterUser(user);

                // 2. 디폴트 사용자 권한 등록
                List<UserRole> authorities = user.getAuthorities();
                if (user.getUserUid().longValue() > 0) {
                    if ((authorities != null) && !authorities.isEmpty()) {
                        for( int i = 0; i < authorities.size(); i++) {
                            authorities.get(i).setUserUid(user.getUserUid());
                        }
                    } else {
                        String defaultUserRole = appConfigDAO.selectValueByKey(AppConfigService.DEFAULT_USER_ROLE);
                        authorities = new ArrayList<>();
                        UserRole defaultAuthority = new UserRole();
                        defaultAuthority.setUserUid(user.getUserUid());
                        if (StringUtils.isBlank(defaultUserRole)) {
                            defaultAuthority.setUserRole(AppContant.UserRoles.USER.getValue());
                        } else {
                            defaultAuthority.setUserRole(defaultUserRole);
                        }

                        defaultAuthority.setRegUid(reqUserUid);
                        authorities.add(defaultAuthority);
                    }
                }

                createUserAuthorities(authorities);

                // 3. 디폴트 사용자 그룹 멤버 등록
                String defaultGroupUid = appConfigDAO.selectValueByKey(AppConfigService.DEFAULT_USER_GROUP);
                if (StringUtils.isNotBlank(defaultGroupUid) && StringUtils.isNumeric(defaultGroupUid)) {
                    GroupMember gm = new GroupMember();
                    gm.setUserUid(user.getUserUid());
                    gm.setGrpUid(Long.valueOf(defaultGroupUid));
                    gm.setRegUid(reqUserUid);
                    userDAO.insertGroupMember(gm);
                }

            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        if (insCount == 1) {
            return user;
        } else {
            return null;
        }
    }

    private User configUserDefault(User user)
    {
        // 디폴트 값 설정
        if (StringUtils.isBlank(user.getAccountNickname())) {
            user.setAccountNickname(user.getAccountName());
        }
        if (StringUtils.isBlank(user.getActive())) {
            user.setActive(AppContant.CommonValue.YES.getValue());
        }
        if (StringUtils.isBlank(user.getAccountLocked())) {
            user.setAccountLocked(AppContant.CommonValue.NO.getValue());
        }
        if (StringUtils.isBlank(user.getVerifiedEmail())) {
            user.setVerifiedEmail(AppContant.CommonValue.NO.getValue());
        }
        if (StringUtils.isBlank(user.getVerifiedMobile())) {
            user.setVerifiedMobile(AppContant.CommonValue.NO.getValue());
        }
        if (StringUtils.isBlank(user.getAccountType())) {
            user.setAccountType(UserService.UserType.PRIVATE.getValue());
        }

        return user;
    }

    /**
     * 로그인 사용자 정보 수정
     * @param user
     * @return
     */
    @CacheEvict(value="userInfo", allEntries = true)
    @Transactional
    public User modifyUser(User user)
    {
        try {
            userDAO.updateUser(user);
//            samshinEventPublisher.publishRegisterUser(user);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return user;
    }

    /**
     * 로그인 사용정보 삭제
     * @param userUid
     * @return
     */
    @CacheEvict(value="userInfo", allEntries = true)
    @Transactional
    public int removeUserPermanent(@NonNull Long userUid) throws Exception
    {
        // 키 체크
        if ((userUid == null) || (userUid.longValue() == 0)) {
            throw new CRequiredException();
        }

        // 참조정보 삭제
        GroupMember gm = new GroupMember();
        gm.setUserUid(userUid);
        try {
            // 멤버 정보 삭제
            userDAO.deleteGroupMember(gm);
            int processCount = userDAO.deleteUser(userUid);
            return processCount;
        } catch (Exception e) {
            log.error( "{} removeUserPermanent {}", this.getClass().getName(), e.getMessage());
            throw new CBizProcessFailException("로그인 사용자 삭제 실패");
        }
    }

    /**
     * PK 기준 사용자 정보 조회
     * @param userUid
     * @return
     * @throws Exception
     * @Cacheable(value = "users", key = "#userUid")
     */
    @Cacheable(value = "userInfo", key="#userUid")
    @Transactional(readOnly = true)
    public User findUserByKey(@NonNull Long userUid) throws Exception
    {
        if (userUid.longValue() == 0) {
            throw new CRequiredException("사용자 ID가 유효하지 않습니다.");
        }

        return userDAO.selectUserByKey(userUid);
    }

    /**
     * 사용자 정보 조회
     * @param accountId
     * @return
     */
    @Cacheable(value = "userInfo", key="#accountId")
    @Transactional(readOnly = true)
    public User findByAccountId(@NotNull String accountId) throws Exception
    {
        if (StringUtils.isBlank(accountId)) {
            throw new CInvalidArgumentException("사용자 ID가 유효하지 않습니다.");
        }

        try {
            User user = userDAO.selectUserById(accountId);
            if (user != null) {
                // 사용자 권한 조회
                List<UserRole> authorities = findUserAuthoritiesByKey(user.getUserUid());
                user.setAuthorities(authorities);

                return user;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return null;
    }

    /**
     * 로그인 사용자 목록 조회
     * @param cond
     * @return
     */
    @Cacheable(value = "userInfo")
    @Transactional(readOnly = true)
    public List<User> findUsers(User cond)
    {
        List<User> users = new ArrayList<>();

        try {
            return userDAO.selectUsers(cond);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new CUnknownException();
        }

    }

    /**
     * 직원계정 조회
     * @param cond
     * @return
     * @throws Exception
     */
    public List<Map<String, Object>> findEmployee(User cond) throws Exception
    {
        try {
            return userDAO.selectEmployeeUsers(cond);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new CUnknownException();
        }
    }

    /**
     * 사용자 암호 체크
     * @param userUid
     * @param newPassword
     * @param reqUserUid
     * @return
     */
    @Transactional
    public int modifyUserPassword(@NonNull Long userUid, String newPassword, Long reqUserUid)
    {
        // 키 체크
        if (userUid == null || (userUid.longValue() == 0)) {
            throw new CRequiredException();
        }

        // 암호유효성 체크
        if (!validPassword(newPassword)) {
            throw new CInvalidPasswordException();
        }

        User user = new User();
        user.setUserUid(userUid);
        user.setModUid(reqUserUid);
        // 사용자 패스워드 암호화
        user.setAccountPwd(CipherUtil.sha512encrypt(newPassword));

        try {
            return userDAO.updateUser(user);
        } catch (Exception e) {
            log.error( "{} modifyUser {}", this.getClass().getName(), e.getMessage());
        }
        return -1;
    }

    /**
     * 암호 유효성 체크
     * @param pwd
     * @return
     */
    private boolean validPassword(String pwd)
    {
        Pattern passPattern1 = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,}$"); // 6자이상 문자 + 숫자
        Pattern passPattern2 = Pattern.compile("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{6,}$"); // 6자이상 문자 + 숫자
        Matcher passMatcher1 = passPattern1.matcher(pwd);
        Matcher passMatcher2 = passPattern2.matcher(pwd);

        if (!passMatcher1.find() && !passMatcher2.find()) {
            return false;
        }

        return true;
    }

    /**
     * 사용자 그룹 초기화
     * @param grpUid
     * @param regUid
     * @return
     * @throws Exception
     */
    @Transactional
    public int apppendGroupAuthority(Long grpUid, Long regUid, String menuType) throws Exception
    {
        if ( (grpUid == null) || (grpUid.longValue() == 0)
                || (regUid == null) || (regUid.longValue() == 0) )
        {
            throw new CRequiredException();
        }

        return userDAO.appendGroupAuthority(grpUid, regUid, menuType);
    }


    /**
     * 사용자 UID 로 Role 목록 조회
     * @param userUid   로그인 사용자 UID
     * @return  사용자 Role 목록
     */
    @Cacheable(value = "userRoleInfo", key = "#userUid")
    @Transactional(readOnly = true)
    public List<UserRole> findUserAuthoritiesByKey(@NotNull Long userUid)
    {
        try {
            List<UserRole> resultSet = userDAO.selectUserRoleByKey(userUid);
            return resultSet;
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 로그인 계정 ID(accountId)로 Role 목록 조회
     * @param accountId
     * @return
     */
    @Transactional(readOnly = true)
    public List<UserRole> findUserAuthoritiesById(@NotNull String accountId)
    {
        try {
            List<UserRole> resultSet = userDAO.selectUserRoleById(accountId);
            return resultSet;
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return null;
    }

    /**
     * 사용자 Role 등록
     * @param data
     * @return
     */
    @CacheEvict(value = "userRoleInfo", allEntries = true)
    @Transactional
    public UserRole createUserAuthority(UserRole data)
    {
        if ( (data == null) || (data.getUserUid() < 1) ) {
            throw new CInvalidArgumentException("사용자 UID는 필수항목입니다.");
        }

        // Default authority - USER 등록
        if (StringUtils.isBlank(data.getUserRole())) {
            data.setUserRole(AppContant.UserRoles.USER.getValue());
        }

        try {
            // 삭제 후 등록
            removeUserAuthority(data);
            int cnt = userDAO.insertUserRole(data);
            if (cnt == 1){
                return data;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return null;
    }

    /**
     * 사용자 Role 목록 등록
     * @param authorities
     * @return
     */
    @CacheEvict(value = "userRoleInfo", allEntries = true)
    @Transactional
    public int createUserAuthorities(List<UserRole> authorities)
    {
        if (authorities.isEmpty()) {
            return 0;
        }
        int count = 0;
        try {
            for(UserRole item : authorities) {
                UserRole newData = createUserAuthority(item);
                if (newData != null) {
                    count++;
                }
            }
        } catch (Exception e) {
            throw new CBizProcessFailException("사용자 권한 등록에 실패하였습니다.");
        }

        return count;
    }

    /**
     * 사용자 Role 삭제
     * @param data
     * @return
     */
    @CacheEvict(value = "userRoleInfo", allEntries = true)
    @Transactional
    public int removeUserAuthority(@NotNull UserRole data)
    {
        if ((data.getUserUid() == null) || data.getUserUid() < 1) {
            throw new CInvalidArgumentException("사용자 UID는 필수항목입니다.");
        }
        if (StringUtils.isBlank(data.getUserRole())) {
            throw new CInvalidArgumentException("사용자 Role은 필수항목입니다.");
        }

        try {
            return userDAO.deleteUserRole(data);
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return 0;
    }

    /**
     * 사용자 그룹 목록 조회
     * @param cond
     * @return
     * @throws Exception
     */
    @Cacheable("userGroupInfo")
    @Transactional(readOnly = true)
    public List<Group> findGroups(Group cond) throws Exception
    {
        return userDAO.selectGroups(cond);
    }

    /**
     * 사용자 그룹 목록 조회 코드 검색용
     * @param cond
     * @return
     * @throws Exception
     */
    @Cacheable("userGroupInfo")
    @Transactional(readOnly = true)
    public List<Map<String, String>> findGroupForHelper(Group cond) throws Exception
    {
        return userDAO.selectGroupsForHelper(cond);
    }

    /**
     * PK 기반 그룹 정보 조회
     * @param grpUid
     * @return
     * @throws Exception
     */
    @Cacheable(value="userGroupInfo", key="#grpUid")
    @Transactional(readOnly = true)
    public Group findGroupByKey(Long grpUid) throws Exception
    {
        return userDAO.selectGroupsByKey(grpUid);
    }


    /**
     * 사용자 그룹등록
     * @param data
     * @return
     */
    @CacheEvict(value = "userGroupInfo", allEntries = true)
    @Transactional
    public Group createGroups(@NotNull Group data)
    {
        if ( StringUtils.isBlank(data.getGrpName()) ) {
            throw new CInvalidArgumentException("그룹명은 필수항목입니다.");
        }

        try {
            int cnt = userDAO.insertGroups(data);
            if (cnt == 1) {
                return data;
            } else {
                return null;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return null;
    }

    /**
     * 사용자 그룹 수정
     * @param group
     * @return
     * @throws Exception
     */
    @CacheEvict(value = "userGroupInfo", allEntries = true)
    @Transactional
    public Group modifyGroups(@NonNull Group group) throws Exception
    {
        if (group.getGrpUid() == null) {
            throw new CRequiredException();
        }
        int updated = userDAO.updateGroups(group);
        if (updated > 0) {
            return group;
        } else {
            return null;
        }
    }


    /**
     * 사용자 그룹 삭제
     *  - 멤버 삭제
     * @param groupId
     * @return
     */
    @CacheEvict(value = "userGroupInfo", allEntries = true)
    @Transactional
    public int removeGroups(@NotNull Long groupId)
    {
        try {
            int cnt = userDAO.deleteGroups(groupId);
            if (cnt ==  1) {
                // 그룹 멤버 삭제
                userDAO.deleteAllGroupMember(groupId);
                // 그룹 권한 삭제
                userDAO.deleteGroupAuthority(groupId, null);
            }
            return cnt;
        } catch (Exception e) {
            log.error(e.getMessage());
            throw new CBizProcessFailException();
        }
    }

    @Async
    @Transactional
    public void writeLastLogin(User loginUser, String ip) {
        loginUser.setLastLoginIp(StringUtils.defaultString(ip));
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        loginUser.setLastLoginDt(now.format(dtf));
        try {
            userDAO.updateUser(loginUser);
        } catch (Exception e) {
            log.error("[ERROR] update last login log data");
        }
    }

    @Transactional(readOnly = true)
    public List<User> findGroupMember(Long grpUid) throws Exception
    {
        if (grpUid == null || grpUid.longValue() == 0) {
            throw new CRequiredException();
        }

        List<User> resultSet = userDAO.selectGroupMembers(grpUid);
        return resultSet;
    }

    @Transactional(readOnly = true)
    public List<User> findGroupOtherMember(Long grpUid) throws Exception
    {
        if (grpUid == null || grpUid.longValue() == 0) {
            throw new CRequiredException();
        }

        List<User> resultSet = userDAO.selectGroupOtherMembers(grpUid);
        return resultSet;
    }

    /**
     * 사용자 그룹 멤버 등록
     * @param data
     * @return
     */
    @Transactional
    public GroupMember createGroupMember(@NotNull GroupMember data)
    {
        if ( (data.getUserUid() == null) || (data.getUserUid() < 1)) {
            throw new CInvalidArgumentException("사용자 UID는 필수항목입니다.");
        } else if ( (data.getGrpUid() == null) || (data.getGrpUid() < 1)) {
            throw new CInvalidArgumentException("그룹 ID는 필수항목입니다.");
        }

        try {
            int cnt = userDAO.insertGroupMember(data);
            if (cnt == 1) {
                return data;
            }
        } catch (Exception e) {
            log.error(e.getMessage());
        }

        return null;
    }

    /**
     * 사용자 그룹 개별 멤버 삭제
     * @param data
     * @return
     */
    @Transactional
    public int removeGroupMember(@NotNull GroupMember data)
    {
        if ( (data.getUserUid() == null) || (data.getUserUid().longValue() == 0)) {
            throw new CInvalidArgumentException("사용자 UID는 필수항목입니다.");
        }

        try {
            return userDAO.deleteGroupMember(data);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return 0;
    }

    /**
     * 사용자 그룹 전체 멤버 삭제
     * @param grpId
     * @return
     */
    @Transactional
    public int removeAllGroupMember(@NotNull Long grpId)
    {
        if ( (grpId.longValue() < 1L)) {
            throw new CInvalidArgumentException("그룹 ID는 필수항목입니다.");
        }

        try {
            return userDAO.deleteAllGroupMember(grpId);
        } catch (Exception e) {
            log.error(e.getMessage());
        }
        return 0;
    }

    @Transactional(readOnly = true)
    public List<GroupAuthority> findGroupAuthority(@NotNull Long grpUid, @NotNull Long parentUid) throws Exception
    {
        List<GroupAuthority> menus = userDAO.selectGroupAuthority(grpUid, parentUid < 1 ? null : parentUid);
        List<GroupAuthority> childMenus = new ArrayList<>();
        if (menus == null) return null;
        for(GroupAuthority menu : menus)
        {
            // 모델 변경으로 인한 수정필요
            List<GroupAuthority> child = findGroupAuthority(grpUid, menu.getOid().longValue());
            childMenus.addAll(child);
        }
        menus.addAll(childMenus);
        return menus;
    }

//    @Cacheable("permissionInfo")
    @Transactional(readOnly = true)
    public List<GroupAuthority> findGroupAuthorityWithMenu(@NotNull Long grpUid, @NotNull Long parentUid, @NonNull Long reqUserUid) throws Exception
    {
        List<GroupAuthority> menus = userDAO.selectGroupAuthorityWithMenu(grpUid, parentUid);
        if (menus == null) return null;
        for(GroupAuthority menu : menus)
        {
            // 모델 변경으로 인한 수정필요
            //menu.setRegUid(reqUserUid);
            saveGroupAuthority(menu);
//            List<GroupAuthority> child = findGroupAuthorityWithMenu(grpUid, menu.getMenuUid());
//            menu.setChild( child );
        }
        return menus;
    }

    // @Cacheable("permissionInfo")
    @Transactional(readOnly = true)
    public List<GroupAuthority> findGroupAuthorityAllMenu(@NotNull Long grpUid, @NotNull Long parentUid) throws Exception
    {
        List<GroupAuthority> menus = userDAO.selectGroupAuthorityAllMenu(grpUid, parentUid);
        if (menus == null) {
            return null;
        }

        for(GroupAuthority menu : menus)
        {
            if (menu.getMenuType().equals("S") || menu.getMenuType().equals("D") ) {
                //List<GroupAuthority> child = findGroupAuthorityAllMenu(grpUid, menu.getMenuUid());
                // 모델 변경으로 인한 수정필요
                //List<GroupAuthority> child = findGroupAuthorityAllMenu(grpUid, menu.getMenuUid());
                //menu.setChild( child );
            }
        }
        return menus;
    }

    /**
     * 사용자 그룹 권한 저장
     * @param data
     * @return
     * @throws Exception
     */
    @CacheEvict(value = "permissionInfo", allEntries = true)
    @Transactional
    public GroupAuthority saveGroupAuthority(@NonNull GroupAuthority data) throws Exception
    {
        if ( (data.getGrpUid() == null) || (data.getGrpUid().longValue() == 0)
                || (data.getOid() == null) || (data.getOid().longValue() == 0) )
        {
            throw new CRequiredException();
        }

        int resultCount = userDAO.saveGroupAuthority(data);
        if (resultCount > 0) {
            return data;
        }

        return null;
    }

    @CacheEvict(value = "permissionInfo", allEntries = true)
    @Transactional
    public List<GroupAuthority> batchGroupAuthority(List<GroupAuthority> dataList, Long reqUserUid) {
        try (SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.BATCH)) {
            UserDAO mapper = sqlSession.getMapper(UserDAO.class);

            for (GroupAuthority data : dataList) {
                // 모델 변경으로 인한 수정필요
                //data.setRegUid(reqUserUid);
                mapper.saveGroupAuthority(data);
            }
            sqlSession.flushStatements();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return dataList;
    }

    @CacheEvict(value = "permissionInfo", allEntries = true)
    @Transactional
    public int replaceGroupAuthority(Long fromGrpUid, Long toGrpUid, Long regUid) throws Exception
    {
        if ( (fromGrpUid == null) || (fromGrpUid.longValue() == 0)
                || (toGrpUid == null) || (toGrpUid.longValue() == 0)
                || (regUid == null) || (regUid.longValue() == 0) )
        {
            throw new CRequiredException();
        }

        return userDAO.copyGroupAuthority(fromGrpUid, toGrpUid, regUid);
    }


}
