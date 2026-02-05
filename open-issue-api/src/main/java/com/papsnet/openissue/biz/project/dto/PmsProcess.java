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
@SuperBuilder
public class PmsProcess extends DObject {
    public String processType ;
    @Nullable
    public Integer id ;

    public String dependency ;
    @Nullable
    public Integer dependencyType ;
    @Nullable
    public Date estStartDt ;
    @Nullable
    public Date estEndDt ;
    @Nullable
    public Integer estDuration ;
    @Nullable
    public Date actStartDt ;
    @Nullable
    public Date actEndDt ;
    @Nullable
    public Integer actDuration ;
    @Nullable
    public Integer level ;
    @Nullable
    public Integer complete ;

    public String no ;

//System
    @Nullable
    public Integer rootOID ;

    public String rootNm ;

    public String rootOEM ;

    public String rootCarType ;

    public String rootItem ;
    @Nullable
    public Integer delay ;

    public String approvStatus ;
    @Nullable
    public Integer itemNo ;
    @Nullable
    public Integer oemLibOID ;
    @Nullable
    public Integer carLibOID ;
    public List<PmsRelationship> members ;

    //진척률
    @Nullable
    public Integer progressRate ;

    //스킵 유무
    @Nullable
    public Integer isSkipped;
    
    public String gateName ;
}
