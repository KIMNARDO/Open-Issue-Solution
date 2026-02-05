package com.papsnet.openissue.common.dto;

import com.papsnet.openissue.common.interfaces.IDObject;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Schema(name = "ApprovalComment", description = "승인 코멘트 DTO")
public class ApprovalComment extends DObject implements IDObject {
    @Schema(description = "승인 OID")
    @Nullable
    private Integer approvalOID;

    @Schema(description = "코멘트")
    private String comment;

    @Schema(description = "정렬 순서")
    @Nullable
    private Integer ord;
}
