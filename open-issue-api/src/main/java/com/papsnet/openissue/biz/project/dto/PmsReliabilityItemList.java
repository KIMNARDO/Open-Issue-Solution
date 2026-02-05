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
public class PmsReliabilityItemList extends DObject {
    @Nullable
    private Integer fromOID;
    private String testItemNm;
    private String testStandardNo;
    private String testCondition;
    private String sample;
    private String etc;
}
