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
public class CustomerSchedule extends DObject {
    @Nullable
    private Date startDt;
    @Nullable
    private Integer carLibOID; // Car_Lib_OID
    @Nullable
    private Integer projectOID; // ProjectOID (nullable for template rows)
    // Ord column mapped to inherited 'row' from DObject to keep consistency across mappers
}
