package com.papsnet.openissue.auth.dao;

import com.papsnet.openissue.auth.dto.*;
import jakarta.validation.constraints.NotNull;
import lombok.NonNull;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Table :
 *  ST_USERS
 *  ST_GROUPS
 */
@Mapper
public interface UserDAO {
    /* ST_USERS */
    User selectUserByKey(@NonNull Long userUid) throws Exception;
    User selectUserById(@NonNull String accountId) throws Exception;
    List<User> selectUsers(User cond) throws Exception;
    int insertUser(@NonNull User data) throws Exception;
    int updateUser(@NonNull User data) throws Exception;
    int deleteUser(@NonNull Long userUid) throws Exception;
    List<Map<String, Object>> selectEmployeeUsers(User cond) throws Exception;

    /* USER_ROLE */
    List<UserRole> selectUserRoleByKey(@NotNull Long userUid) throws Exception;
    List<UserRole> selectUserRoleById(@NotNull String accountId) throws Exception;
    int insertUserRole(@NotNull UserRole data) throws Exception;
    int deleteUserRole(@NotNull UserRole data) throws Exception;

    /* ST_AUTH_GROUPS */
    List<Group> selectGroups(@NotNull Group data) throws Exception;
    List<Map<String, String>> selectGroupsForHelper(Group cond) throws Exception;
    Group selectGroupsByKey(Long grpUid) throws Exception;
    Group selectGroupsByUserUid(Long userUid) throws Exception;
    int insertGroups(@NotNull Group data) throws Exception;
    int updateGroups(@NonNull Group data) throws Exception;
    int deleteGroups(@NotNull Long grpId) throws Exception;

    /* Group Member */
    List<User> selectGroupMembers(Long grpUid) throws Exception;

    List<User> selectGroupOtherMembers(Long grpUid) throws Exception;
    int insertGroupMember(@NotNull GroupMember data) throws Exception;
    int deleteGroupMember(@NotNull GroupMember data) throws Exception;
    int deleteAllGroupMember(@NotNull Long grpId) throws Exception;

    List<GroupAuthority> selectGroupAuthority(Long grpUid, Long parentUid) throws Exception;
    /* Group Authority */
    List<GroupAuthority> selectGroupAuthorityWithMenu(Long grpUid, Long parentUid) throws Exception;
    List<GroupAuthority> selectGroupAuthorityAllMenu(Long grpUid, Long parentUid) throws Exception;
    int appendGroupAuthority(@NonNull @Param("grpUid") Long grpUid, @Param("regUid") @NonNull Long regUid, @Param("menuType") String menuType) throws Exception;
    int appendNotExistGroupAuth(@NonNull @Param("menuUid") Long menuUid, @Param("regUid") @NonNull Long regUid) throws Exception;
    int deleteGroupAuthority(Long grpUid, Long menuUid) throws Exception;
    int deleteLinkedGroupAuthority(int menuUid) throws Exception;
    int copyGroupAuthority(Long fromGrpUid, Long toGrpUid, Long regUid) throws Exception;
    int saveGroupAuthority(GroupAuthority data) throws Exception;

    RefreshToken selectRefreshToken(Long userUid) throws Exception;
    int insertRefreshToken(RefreshToken data) throws Exception;
    int updateRefreshToken(RefreshToken data) throws Exception;
}
