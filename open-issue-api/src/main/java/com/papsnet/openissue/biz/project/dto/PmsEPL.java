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
public class PmsEPL extends DObject {
    private String obNO;
    @Nullable
    private Integer salesOrderOID;
    @Nullable
    private Integer programOID;
    @Nullable
    private Integer projectOID;
    private String jsonContent;
    private String jsonData;
    private List<PmsEPLItem> pmsEPLItem;
    private List<PmsEPLItem> pmsEPLItemAllRows;
    private PmsEPLSpec pmsEPLSpec;
    @Nullable
    private Integer dataRowCount;
    @Nullable
    private Integer specCount;
    private List<Integer> programOIDs;
    private List<DelBomFile> delBomFile;
    @Nullable
    private Integer maxTempPart;
    private String spec;
    private String repPartNo;
    // ChangeOrder
    @Nullable
    private Integer changeOrderOID;
    private String eoFlag;
    private String convNm;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @SuperBuilder
    public static class DelBomFile {
        @Nullable
        private Integer row;
        @Nullable
        private Integer col;
        private String type;
        private String convNm;
        private String tempPartNo;
    }
}
