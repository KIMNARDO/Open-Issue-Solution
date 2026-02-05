package com.papsnet.openissue.auth.service;

import com.papsnet.openissue.auth.dao.UserDAO;
import com.papsnet.openissue.auth.dto.Group;
import com.papsnet.openissue.auth.dto.Person;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserAndPersonService {
    private final UserService userService;
    private final PersonService personService;
    private final UserDAO userDAO;

    public Person selectUserInfoByAccountId(String accountId) throws Exception {
        Person personInfo = personService.selPersonByAccountId(accountId);
        Group personGroup = userDAO.selectGroupsByUserUid(personInfo.getOid().longValue());
        if(personGroup != null) {
            personInfo.setGroupAuthority(userService.findGroupAuthority(personGroup.getGrpUid(), 0L));
        }

        return personInfo;
    };
}
