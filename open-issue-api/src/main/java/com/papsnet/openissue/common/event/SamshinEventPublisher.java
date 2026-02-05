package com.papsnet.openissue.common.event;

import com.papsnet.openissue.auth.dto.User;
import com.papsnet.openissue.auth.event.LoginUserEvent;
import com.papsnet.openissue.auth.event.RegisterUserEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class SamshinEventPublisher {
    @Autowired
    private ApplicationEventPublisher applicationEventPublisher;

    public void publishRegisterUser(final User msg)
    {
        log.debug("👉 Publishing Update User status update Event");
        RegisterUserEvent evt = new RegisterUserEvent(this, msg);
        applicationEventPublisher.publishEvent(evt);
    }

    public void publishLoginUser(final User msg)
    {
        log.debug("👉 Publishing Update User status update Event");
        LoginUserEvent evt = new LoginUserEvent(this, msg);
        applicationEventPublisher.publishEvent(evt);
    }
}
