package com.papsnet.openissue.common.dto;

import com.papsnet.openissue.common.interfaces.IDObject;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.List;

@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Schema(name = "ApprovalStep", description = "승인 단계 DTO")
public class ApprovalStep extends DObject implements IDObject {
    @Schema(description = "승인 OID")
    @Nullable
    private Integer approvalOID;

    @Schema(description = "정렬 순서")
    @Nullable
    private Integer ord;

    @Schema(description = "승인 유형")
    private String approvalType;

    @Schema(description = "수신 작업 목록")
    private List<ApprovalTask> inboxTask;
}
