package com.papsnet.openissue.auth.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserTokenDTO {
    @Schema(description = "사용자 UID")
    @JsonProperty("userUid")
    private Long userUid;

    @Schema(description = "토큰")
    @JsonProperty("token")
    private JwtToken token;

    public UserTokenDTO(String token){

    }
}
