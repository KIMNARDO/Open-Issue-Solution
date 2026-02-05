package com.papsnet.openissue.biz.openIssue.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.papsnet.openissue.common.dto.DLibrary;
import com.papsnet.openissue.common.dto.DObject;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Schema(description = "T_DOPENISSUE_GROUPDEF - 오픈이슈 상세")
@EqualsAndHashCode(callSuper = true)
@Data
@Alias("openIssueGroupDef")
public class OpenIssueGroupDef extends DObject {
//    @Schema(description = "오픈이슈 ID")
//    @JsonProperty("openIssueGroup")
//    private Integer openIssueGroup;
//
//    @Schema(description = "오픈이슈 제목")
//    @JsonProperty("groupName")
//    private String groupName;
//
//    @Schema(description = "상태")
//    @JsonProperty("groupStatus")
//    private String groupStatus;


    @Schema(description = "상위 OID")
    @JsonProperty("fromOid")
    private Integer fromOid;

    @Schema(description = "상위 명")
    @JsonProperty("fromNm")
    private String fromNm;

    @Schema(description = "그룹 타입")
    @JsonProperty("groupType")
    private String groupType;

    @Schema(description = "그룹")
    @JsonProperty("groupDepartmentOid")
    private Integer groupDepartmentOid;

    @Schema(description = "업데이트시 사용할 상태(Perpare,Completed)")
    @JsonProperty("groupStatus")
    private String groupStatus;

    @Schema(description = "오픈이슈 연결")
    @JsonProperty("openIssueRelationship")
    private List<OpenIssueRelationship> openIssueRelationship;

    @Schema(description = "오픈이슈 카테고리 연결")
    @JsonProperty("groupCategory")
    private List<OpenIssueGroupCategory> groupCategory;

    @Schema(description = "순서")
    @JsonProperty("ord")
    private Integer ord;
}

