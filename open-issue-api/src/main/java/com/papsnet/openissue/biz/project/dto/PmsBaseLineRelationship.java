package com.papsnet.openissue.biz.project.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PmsBaseLineRelationship extends PmsRelationship {
    @Nullable
    private Integer relBaseLineOID;
    @Nullable
    private Integer rootBaseLineOID;
    private String projectBaseLineNm;
    private PmsRelationship baseData;
    private List<PmsBaseLineRelationship> baseLineChildren;
    private List<PmsBaseLineRelationship> baseLIneMembers;
}
