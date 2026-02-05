package com.papsnet.openissue.auth.event;

import com.papsnet.openissue.auth.dto.User;
import org.springframework.context.ApplicationEvent;

public class LoginUserEvent extends ApplicationEvent {
    private User mUser;

    public LoginUserEvent(Object source, User user)
    {
        super(source);
        this.mUser = user;
    }

    public User getUser()
    {
        return this.mUser;
    }
}
