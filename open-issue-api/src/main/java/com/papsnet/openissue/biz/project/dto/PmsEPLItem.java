package com.papsnet.openissue.biz.project.dto;

import com.papsnet.openissue.common.dto.DObject;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class PmsEPLItem extends DObject {
    @Nullable
    private Integer eplOID;
    @Nullable
    private Integer specOID;
    private String action;
    @Nullable
    private Integer step;

    private String custPartNo;
    private String partNo;
    private String partNm;
    private String division;
    private String material;
    private String car;
    private String size;
    private String weight;
    private String unit;
    @Nullable
    private Integer count;
    private String twoDimensional;
    @Nullable
    private Integer twoDimensionalFileOID;
    private String threeDimensional;
    @Nullable
    private Integer threeDimensionalFileOID;
    private String msl;
    private String aec;
    @Nullable
    private Date startDt;
    @Nullable
    private Date endDt;
    private String reference;
    private String spec20;
    private String spec21;
    private String spec22;
    private String spec23;
    private String spec24;
    private String spec25;
    private String spec26;
    private String spec27;
    private String spec28;
    private String spec29;
    private String spec30;
    private String spec31;
    private String spec32;
    private String spec33;
    private String spec34;
    private String spec35;
    private String spec36;
    private String spec37;
    private String spec38;
    private String spec39;
    private String spec40;
    private String spec41;
    private String spec42;
    private String spec43;
    private String spec44;
    private String spec45;
    private String spec46;
    private String spec47;
    private String spec48;
    private String spec49;
    private String columnName;

    @Nullable
    private Integer fromOID;
    @Nullable
    private Integer toOID;
    private List<Integer> eplOIDs;

    // Hierarchy
    private PmsEPLItem parentNode;
    private List<PmsEPLItem> childNodes;
}
