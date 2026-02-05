package com.papsnet.openissue.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

/**
 * DTO converted from C# DFileHistory
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Alias("dFileHistory")
public class DFileHistory extends BaseDTO {

    @Schema(description = "순번")
    @JsonProperty("seq")
    private Integer seq;

    @Schema(description = "파일 OID")
    @JsonProperty("fileOid")
    private Integer fileOid;

    @Schema(description = "원본 파일명")
    @JsonProperty("orgNm")
    private String orgNm;

    // OBJECT
    @Schema(description = "객체 OID")
    @JsonProperty("oid")
    private Integer oid;

    @Schema(description = "객체 명")
    @JsonProperty("name")
    private String name;

    // OBJECT Type
    @Schema(description = "객체 타입")
    @JsonProperty("type")
    private String type;

    @Schema(description = "액션 타입")
    @JsonProperty("actionType")
    private String actionType;

    @Schema(description = "액션 사용자 UID")
    @JsonProperty("actionUser")
    private Integer actionUser;

    @Schema(description = "액션 사용자 명")
    @JsonProperty("actionUserNm")
    private String actionUserNm;

    @Schema(description = "액션 사용자 IP 주소")
    @JsonProperty("actionIpAddress")
    private String actionIpAddress;

    @Schema(description = "액션 일시")
    @JsonProperty("actionDt")
    private String actionDt;

    @Schema(description = "액션 MAC 주소")
    @JsonProperty("actionMacAddress")
    private String actionMacAddress;

    @Schema(description = "세션 ID")
    @JsonProperty("sessionId")
    private String sessionId;

    @Schema(description = "설명")
    @JsonProperty("description")
    private String description;
}
