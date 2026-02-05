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
public class PmsNewCheckList extends DObject {
    @Nullable
    private Integer projectOID;
    @Nullable
    private Integer gateOID;
    @Nullable
    private Integer confirmCheck;
}
