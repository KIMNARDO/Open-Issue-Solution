package com.papsnet.openissue.auth.event;

import com.papsnet.openissue.auth.dto.User;
import com.papsnet.openissue.auth.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class RegisterUserEventListener {
    @Autowired
    private UserService userService;

    @Async("DefaultAsyncTaskPool")
    @EventListener
    public void onRegisterUser(RegisterUserEvent evt)
    {
        log.info("👉 Regsiter user event listener - start");
        User user = evt.getUser();

        if (user == null)
        {
            return ;
        }

        try {

        } catch (Exception e) {
            log.error(e.getMessage());
        }
        log.info("👉 Register User event listener - end");
    }
}
