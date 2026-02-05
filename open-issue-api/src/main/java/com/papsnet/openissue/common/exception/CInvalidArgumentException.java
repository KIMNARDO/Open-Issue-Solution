package com.papsnet.openissue.common.exception;

import com.papsnet.openissue.util.MessageUtil;

public class CInvalidArgumentException extends RuntimeException {
    private static final int ERROR_CODE = -1002;
    private static final String KEY_MSG = "error.invalid.argument";

    public static int getCode(){ return ERROR_CODE; }

    public static String getCustomMessage() {
        return MessageUtil.getMessage(KEY_MSG);
    }

    public CInvalidArgumentException(String msg, Throwable e){ super(msg, e);}
    public CInvalidArgumentException(String msg) { super(msg); }
    public CInvalidArgumentException() { super(MessageUtil.getMessage(KEY_MSG)); }

}
