package com.papsnet.openissue.auth.dao;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.dto.UserTokenDTO;
import com.papsnet.openissue.auth.dto.Verify;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface PersonDAO {
    Optional<Person> findPersonByid(String username);
    List<UserTokenDTO> selTokenList(UserTokenDTO tokenDto);
    UserTokenDTO selToken(UserTokenDTO tokenDto);
    Integer insToken(UserTokenDTO tokenDto);
    List<Person> selPerson(Person person);
    List<Person> selectGroupMembers(Long grpUid);
    Person selPersonById(Integer oid);
    Verify selVerifyByFromId(Integer oid);
    Integer uptVerify(Verify verify);
    Integer insVerify(Verify verify);

    Integer insPerson(Person _param);
    Integer udtPerson(Person _param);
    // Added for password and last login updates (IDs must match mapper IDs)
    Integer udtPwPerson(Person _param);
    Integer udtIpPwPerson(Person _param);
    Integer udtPersonLastLogin(Person _param);
}
