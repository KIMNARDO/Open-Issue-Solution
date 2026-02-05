package com.papsnet.openissue.common.dto;

import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class DLibrary extends DObject {
    public String korNm;    //한글명
    @Nullable
    public Integer fromOID;     //부모 OID
    @Nullable
    public Integer toOID;     //target OID
    public String isUse;    //사용여부
    @Nullable
    public Integer ord;         //순서
    public String isRequired; //필수여부
    public String code1; //코드1
    public String code2; //코드2
    public String isChange; //변경여부
    public String isMove; //순서변경여부
    public String isParentMove; //순서변경여부
    public String isDelete; //부모삭제여부

    public List<DLibrary> cData;
    public List<Integer> fromOIDs;

    //영향성 평가표용
    public String managerNm;
}
