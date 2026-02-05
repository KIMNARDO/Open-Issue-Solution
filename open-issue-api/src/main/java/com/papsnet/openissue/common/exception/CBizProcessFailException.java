package com.papsnet.openissue.common.exception;

import com.papsnet.openissue.util.MessageUtil;

public class CBizProcessFailException extends RuntimeException {
    private static final int ERROR_CODE = -1003;
    private static final String KEY_MSG = "error.biz.process.fail";

    public static int getCode(){
        return ERROR_CODE;
    }

    public static String getCustomMessage() {
        return MessageUtil.getMessage(KEY_MSG);
    }

    public CBizProcessFailException(String msg, Throwable e){ super(msg, e);}
    public CBizProcessFailException(String msg) { super(msg); }
    public CBizProcessFailException() { super(MessageUtil.getMessage(KEY_MSG)); }

}
