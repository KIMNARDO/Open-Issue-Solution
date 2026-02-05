package com.papsnet.openissue.common.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.apache.ibatis.type.Alias;
import org.springframework.lang.Nullable;

import java.util.List;

/**
 * Document Classification DTO
 * Ported to mirror legacy C# DocClass and mapped to T_DDOCUMENT_CLASSIFICATION joined with T_DOBJECT.
 */
@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Alias("docClass")
public class DocClass extends DObject {
    // T_DDOCUMENT_CLASSIFICATION base columns
    @Nullable
    private Integer fromOID;   // 부모 OID
    private String isUse;      // 사용여부(Y/N)
    private String isRequired; // 필수여부(Y/N)

    // Additional fields mirrored from legacy C# DTO (kept for compatibility, not all are used by current mapper)
    private String classification;
    private String code;
    private String viewUrl;
    private String excelContent;

    @Nullable private Integer rootOID;
    @Nullable private Integer toOID;
    private String projectNm;
    private String docClassNm;
    private String taskNm;

    private DocClass parent;
    private List<DocClass> children;

    private String relOID;
    private String relType;
    private String expanded;
    private String docToOID;
    private String docClassOID;
    private String docClassPID;
    private String docClassPIDNm;
    private String docName;
    private String docOID;
    private String docNo;
    private String docNoNm;
    private String docSt;
    private String docStNm;
    private String docRev;
    private String databaseFl;
    private String linkOID;
    private String editUrl;
    private String PMSViewUrl;
    private String PMSEditUrl;
    private String useFl;
    private String isSalesOrder;

    // File lists (compat placeholders). File handling is done via HttpFile APIs in this project.
    private List<HttpFile> files;
    private List<HttpFile> delFiles;
}
