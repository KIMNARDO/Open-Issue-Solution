package com.papsnet.openissue.common.exception;

import com.papsnet.openissue.util.MessageUtil;

public class CDatabaseException extends RuntimeException {
    private static final int ERROR_CODE = -1017;
    private static final String KEY_MSG = "error.database";

    public static int getCode(){
        return ERROR_CODE;
    }

    public static String getCustomMessage() {
        return MessageUtil.getMessage(KEY_MSG);
    }

    public CDatabaseException(String msg, Throwable e){ super(msg, e);}
    public CDatabaseException(String msg) { super(msg); }
    public CDatabaseException() { super(MessageUtil.getMessage(KEY_MSG)); }

}
