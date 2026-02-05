package com.papsnet.openissue.biz.project.dto;

import com.papsnet.openissue.common.dto.DObject;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class PmsReliabilityReport extends DObject {
    @Nullable
    private Integer fromOID;
    @Nullable
    private Integer rootOID;
    @Nullable
    private Integer taskOID;
    @Nullable
    private Integer devStep;

    private Integer totalTestItem;
    private Integer waitingNum;
    private Integer progressNum;
    private Integer completeNum;
    private Integer nGNum;
    private String partNm;
    public String getTotalTestDt() {
        if (totalTestStartDt == null || totalTestEndDt == null) return null;
        return totalTestStartDt.toString() + "~" + totalTestEndDt.toString();
    }
    @Nullable
    private Date totalTestStartDt;
    @Nullable
    private Date totalTestEndDt;
    private String testPurpose;
    private String devStepNm;
    private String reliabilityNm;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @SuperBuilder
    public static class ReportTestItemList extends DObject {
        @Nullable
        private Integer fromOID;
        private Date estStartDt;
        private Date estEndDt;
        private Date actStartDt;
        private Date actEndDt;
        @Nullable
        private Integer progressResult;
        private String progressResultNm;
        private String etc;
    }
}
