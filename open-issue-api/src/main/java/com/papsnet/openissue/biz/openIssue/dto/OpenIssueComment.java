package com.papsnet.openissue.biz.openIssue.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.papsnet.openissue.common.dto.DObject;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.apache.ibatis.type.Alias;

@EqualsAndHashCode(callSuper = true)
@Schema(description = "T_DOPENISSUE_COMMENT - 오픈이슈 코멘트")
@Data
@Alias("openIssueComment")
public class OpenIssueComment extends DObject {
    @Schema(description = "오픈이슈 키")
    @JsonProperty("openIssueOid")
    public Integer openIssueOid;

    @Schema(description = "순서")
    @JsonProperty("ord")
    public Integer ord;

    @Schema(description = "코멘트")
    @JsonProperty("comment")
    public String comment;
}
