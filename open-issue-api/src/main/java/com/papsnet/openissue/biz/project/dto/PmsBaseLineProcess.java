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
public class PmsBaseLineProcess extends PmsProcess {
    @Nullable
    private Integer targetPrcessOID;
    @Nullable
    private Integer rootBaseLineOID;
    @Nullable
    private Integer processOID;
    private String processNm;
}
