package com.papsnet.openissue.biz.project.dto;

import com.papsnet.openissue.common.dto.DObject;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class PmsReliability extends DObject {
    @Nullable
    private Integer fromOID;
    @Nullable
    private Integer rootOID;
    @Nullable
    private Integer taskOID;
    private String requiredSchedule;
    private Integer devStep;
    private String devStepNm;
    private String testStandard;
    private String regNum;
    private String partNo;
    private String carType;
    private java.util.Date testMethodDt;
    private String newVer;
    private String hWVer;
    private String sWVer;
    private String cANVer;
    private String testApplyVer;
    private String testCarType;
    private String testPurpose;
    private String testContents;
    private String sampleQuantity;
    private String testStandardContents;
    private String requirements;
}
