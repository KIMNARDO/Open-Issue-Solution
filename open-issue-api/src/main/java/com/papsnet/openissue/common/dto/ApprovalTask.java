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

@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@Schema(name = "ApprovalTask", description = "승인 작업 DTO")
public class ApprovalTask extends DObject implements IDObject {

    @Schema(description = "승인 OID")
    @Nullable
    private Integer approvalOID;

    @Schema(description = "단계 OID")
    @Nullable
    private Integer stepOID;

    @Schema(description = "담당자 OID")
    @Nullable
    private Integer personOID;

    @Schema(description = "담당자 객체")
    private Person personObj;

    @Schema(description = "승인 유형")
    private String approvalType;

    @Schema(description = "코멘트")
    private String comment;

    @Schema(description = "승인 일시")
    @Nullable
    private Date approvalDt;

    @Schema(description = "액션 타입")
    private String actionType;

    @Schema(description = "정렬 순서")
    @Nullable
    private Integer ord;

    @Schema(description = "부서명")
    private String departmentNm;

    @Schema(description = "사용자명")
    private String personNm;

    @Schema(description = "현재 단계 번호")
    @Nullable
    private Integer currentNum;

    @Schema(description = "문서 OID")
    @Nullable
    private Integer docOID;

    @Schema(description = "문서 타입")
    private String docType;

    @Schema(description = "문서명")
    private String docNm;

    @Schema(description = "문서 URL")
    private String docUrl;

    @Schema(description = "문서 생성자 OID")
    @Nullable
    private Integer docCreateUs;

    @Schema(description = "문서 생성자명")
    private String docCreateNm;

    @Schema(description = "승인 BPolicy")
    private BPolicy approvalBPolicy;

    @Schema(description = "문서 보안정책명")
    private String docBpolicyNm;

    @Schema(description = "프로젝트")
    private String project;

    @Schema(description = "승인 BPolicy OID")
    @Nullable
    private Integer approvalBPolicyOID;
}
