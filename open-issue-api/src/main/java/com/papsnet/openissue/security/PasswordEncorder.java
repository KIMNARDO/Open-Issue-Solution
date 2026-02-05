package com.papsnet.openissue.security;

import com.papsnet.openissue.util.CipherUtil;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordEncorder implements PasswordEncoder {
    @Override
    public String encode(CharSequence rawPassword) {
        return CipherUtil.sha512encrypt((String) rawPassword);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return encodedPassword.equals(encode(rawPassword));
    }
}
