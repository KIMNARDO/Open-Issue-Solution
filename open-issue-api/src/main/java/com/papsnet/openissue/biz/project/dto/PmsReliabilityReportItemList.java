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
public class PmsReliabilityReportItemList extends DObject {
    @Nullable
    private Integer fromOID;
    private String testItemNm;
    @Nullable
    private Date estStartDt;
    @Nullable
    private Date estEndDt;
    @Nullable
    private Date actStartDt;
    @Nullable
    private Date actEndDt;
    @Nullable
    private Integer progressResult;
    private String etc;
}
