package com.papsnet.openissue.common.dto;

import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.common.interfaces.IDObject;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Schema(name = "Approval", description = "승인 DTO")
public class Approval extends DObject implements IDObject {
    // Identifiers and counters
    @Schema(description = "대상 OID")
    @Nullable
    private Integer targetOID;
    @Schema(description = "승인 OID")
    @Nullable
    private Integer approvalOID;
    @Schema(description = "승인 카운트")
    @Nullable
    private Integer approvalCount;

    // General
    @Schema(description = "코멘트")
    private String comment;
    @Schema(description = "현재 단계 번호")
    @Nullable
    private Integer currentNum;

    // Inbox-related collections
    @Schema(description = "수신 단계 목록")
    private List<ApprovalStep> inboxStep;
    @Schema(description = "수신 코멘트 목록")
    private List<ApprovalComment> inboxCommnet; // keeping legacy field name (typo) for compatibility

    // Options
    @Schema(description = "자동 상태 여부")
    @Nullable
    private Boolean autoStatus;

    // Document info
    @Schema(description = "문서 타입")
    private String docType;
    @Schema(description = "문서 URL")
    private String docUrl;
    @Schema(description = "문서 OID")
    @Nullable
    private Integer docOID;
    @Schema(description = "문서명")
    private String docNm;
    @Schema(description = "문서 생성자 OID")
    @Nullable
    private Integer docCreateUs;
    @Schema(description = "문서 생성자명")
    private String docCreateNm;
    @Schema(description = "문서 보안정책명")
    private String docBpolicyNm;

    // Person (requester/owner)
    @Schema(description = "담당자 객체")
    private Person personObj;
    @Schema(description = "담당자명")
    private String personNm;
    @Schema(description = "담당자 OID")
    @Nullable
    private Integer personOID;
    @Schema(description = "부서명")
    private String departmentNm;

    // Misc
    @Schema(description = "프로젝트")
    private String project;
    @Schema(description = "승인 일시")
    @Nullable
    private Date approvalDt;
}
