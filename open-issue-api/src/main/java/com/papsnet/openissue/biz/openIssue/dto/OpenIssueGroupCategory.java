package com.papsnet.openissue.biz.openIssue.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.papsnet.openissue.common.dto.DObject;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

@Schema(description = "T_DOPENISSUE_GROUP_CATEGORY - 오픈이슈 카테고리")
@EqualsAndHashCode(callSuper = true)
@Data
@Alias("openIssueGroupCategory")
public class OpenIssueGroupCategory extends DObject {
    @Schema(description = "오픈이슈 그룹 키")
    @JsonProperty("openIssueGroupCategoryOid")
    public Integer openIssueGroupCategoryOid;

    @Schema(description = "순서")
    @JsonProperty("ord")
    public Integer ord;

    @Schema(description = "값")
    @JsonProperty("value")
    public String value;

    @Schema(description = "추가 수정 삭제")
    @JsonProperty("action")
    public String action;
}
