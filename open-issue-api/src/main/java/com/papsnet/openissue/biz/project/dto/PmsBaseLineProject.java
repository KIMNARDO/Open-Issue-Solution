package com.papsnet.openissue.biz.project.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class PmsBaseLineProject extends PmsProject {
    @Nullable
    private Integer targetProjectOID;
    @Nullable
    private Integer projectBaseLineOID;
    @Nullable
    private Integer projectOID;
    private String projectNm;
}
