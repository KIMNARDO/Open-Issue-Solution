package com.papsnet.openissue.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Data
public class BaseDTO {
    @Schema(description = "등록자UID")
    @JsonProperty("regUid")
    private Long regUid;

    @Schema(description = "등록자명")
    @JsonProperty("regUserName")
    private String regUserName;

    @Schema(description = "등록일시")
    @JsonProperty("regDt")
    private String regDt;

    @Schema(description = "수정자UID")
    @JsonProperty("modUid")
    private Long modUid;

    @Schema(description = "수정자명")
    @JsonProperty("modUserName")
    private String modUserName;

    @Schema(description = "등록일시")
    @JsonProperty("modDt")
    private String modDt;
}
