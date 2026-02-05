package com.papsnet.openissue.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

import java.util.List;

/**
 * DTO converted from C# HttpFile
 */
@EqualsAndHashCode(callSuper = true)
@Data
@Alias("httpFile")
public class HttpFile extends BaseDTO {

    @Schema(description = "파일 OID")
    @JsonProperty("fileOid")
    private Integer fileOid;

    @Schema(description = "객체 OID")
    @JsonProperty("oid")
    private Integer oid;

    @Schema(description = "객체 타입")
    @JsonProperty("type")
    private String type;

    @Schema(description = "원본 파일명")
    @JsonProperty("orgNm")
    private String orgNm;

    @Schema(description = "변환 파일명")
    @JsonProperty("convNm")
    private String convNm;

    @Schema(description = "확장자")
    @JsonProperty("ext")
    private String ext;

    @Schema(description = "파일 크기")
    @JsonProperty("fileSize")
    private Integer fileSize;

    @Schema(description = "등록자 UID")
    @JsonProperty("createUs")
    private Integer createUs;

    @Schema(description = "등록자명")
    @JsonProperty("createUsNm")
    private String createUsNm;

    @Schema(description = "등록일시")
    @JsonProperty("createDt")
    private String createDt;

    @Schema(description = "삭제자 UID")
    @JsonProperty("deleteUs")
    private Integer deleteUs;

    @Schema(description = "삭제자명")
    @JsonProperty("deleteUsNm")
    private String deleteUsNm;

    @Schema(description = "삭제일시")
    @JsonProperty("deleteDt")
    private String deleteDt;

    @Schema(description = "행 번호")
    @JsonProperty("row")
    private Integer row;

    @Schema(description = "행 번호 목록")
    @JsonProperty("rows")
    private List<Integer> rows;

    @Schema(description = "임시 품번")
    @JsonProperty("tempPartNo")
    private String tempPartNo;

    @Schema(description = "임시 품번 목록")
    @JsonProperty("tempPartNos")
    private List<String> tempPartNos;
}
