package com.papsnet.openissue.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Verify {
    @Schema(description = "키값")
    private Integer oid;

    @Schema(description = "유저 키")
    private Integer fromOID;

    @Schema(description = "2차 인증 여부")
    private Integer check2FA;

    @Schema(description = "로그인 락")
    private Date loginLock;
}
