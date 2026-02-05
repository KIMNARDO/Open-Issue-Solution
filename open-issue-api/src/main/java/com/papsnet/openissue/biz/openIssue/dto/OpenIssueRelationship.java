package com.papsnet.openissue.biz.openIssue.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OpenIssueRelationship {
    @Nullable
    public Integer oid;
    @Nullable
    public Integer fromOID;
    @Nullable
    public List<Integer> fromOIDs;
    @Nullable
    public Integer toOID;
    @Nullable
    public List<Integer> toOIDs;
    public String type;
    @Nullable
    public Date createDt;
    @Nullable
    public Integer createUs;
    @Nullable
    public Date deleteDt;
    @Nullable
    public Integer deleteUs;
    @Nullable
    public Date startDate;
    @Nullable
    public Date endDate;

    @JsonProperty("personNm")
    public String personNm;
    @JsonProperty("departmentNm")
    public String departmentNm;
    @JsonProperty("jobTitleNm")
    public String jobTitleNm;
    @JsonProperty("jobTitleOrd")
    public Integer jobTitleOrd;
    @JsonProperty("thumbnail")
    public String thumbnail;
    @JsonProperty("email")
    public String email;

    @Schema(description = "루트")
    @JsonProperty("rootOid")
    public Integer rootOid;

    @Schema(description = "권한")
    @JsonProperty("roleOid")
    public Integer roleOid;

    @Schema(description = "액션")
    @JsonProperty("action")
    private String action;
}
