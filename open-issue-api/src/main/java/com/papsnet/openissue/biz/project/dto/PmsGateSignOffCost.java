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
public class PmsGateSignOffCost {
    private Integer oid;
    private Integer projectOID;
    private Integer row;
    private Integer col;
    private String value;
    private String account;
    private String program;
    private String amount;
    private String ratio;
    private String description;
    @Nullable
    private Date deleteDt;
    @Nullable
    private Integer deleteUs;
}
