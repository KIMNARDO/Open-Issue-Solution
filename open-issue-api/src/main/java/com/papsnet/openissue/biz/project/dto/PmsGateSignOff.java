package com.papsnet.openissue.biz.project.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PmsGateSignOff {
    @Nullable
    private Integer oid;
    private String forecast;
    private String wrCreateStore;
    private String calendarEtc;
    private String nonCompleteIssue;
    private String summaryEtc;
    @Nullable
    private Date createDt;
    @Nullable
    private Integer createUs;
    @Nullable
    private Date modifyDt;
    @Nullable
    private Integer modifyUs;
    @Nullable
    private Integer rootOID;

    @Nullable
    private java.math.BigDecimal devCost;
    @Nullable
    private java.math.BigDecimal moldCost;
    @Nullable
    private java.math.BigDecimal equipCost;
}
