package com.papsnet.openissue.biz.project.dto;

import com.papsnet.openissue.common.dto.DObject;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

/**
 * DTO for T_DPMS_ISSUE_COMMENT
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class PmsIssueComment extends DObject {
    private String comment;           // Comment text
    @Nullable
    private Integer issueBPolicyOID;  // Issue policy OID
    @Nullable
    private Integer issueOID;         // Related Issue OID
    @Nullable
    private Integer approvalType;     // Approval type code
}
