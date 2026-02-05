package com.papsnet.openissue.biz.project.dto;

import com.papsnet.openissue.common.dto.BPolicyAuth;
import com.papsnet.openissue.common.dto.DRelationship;
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
public class PmsRelationship extends DRelationship {
    @Nullable
    public Integer rootOID ;
    @Nullable
    public Integer delay ;

    public List<PmsRelationship> children ;

    public List<String> diseditable ;

    public String expanded;

    public String action ;
    @Nullable
    public Integer roleOID ;

    public String description ;
    @Nullable
    public Integer baseLineOrd ;
    @Nullable
    public Integer taskOID ;

    public String checkListEtc ;

    //Temp Data
    public String objName ;

    public String objType ;
    @Nullable
    public Integer objSt ;

    public String objStNm ;

    public String objStDisNm ;

    public String ObjDescription ;
    @Nullable
    public Integer id ;

    public String dependency ;
    @Nullable
    public Integer dependencyType ;
    @Nullable
    public Integer estDuration ;
    @Nullable
    public Date estStartDt ;
    @Nullable
    public Date estEndDt ;
    @Nullable
    public Integer actDuration ;
    @Nullable
    public Date actStartDt ;
    @Nullable
    public Date actEndDt ;

    public List<PmsRelationship> members ;
    @Nullable
    public Integer complete ;
    @Nullable
    public Integer workingDay ;

    public String roleOIDNm ;

    public String personNm ;

    public String departmentNm ;
    public String jobTitleNm ;
    @Nullable
    public Integer jobTitleOrd ;
    public String thumbnail ;
    public String email ;

    public String no ;

    public String createUsNm ;

    //산출물 오브젝트 데이터
    public String projectNm ;

    public String taskNm ;

    public String viewUrl ;

    public String docClassNm ;

    public String docNm ;

    public String docRev ;

    public String docStNm ;

    public List<BPolicyAuth> bPolicyAuths ;
    public String oemLibNm ;
    public String carLibNm ;
    public String partNm ;
    public String totalTestDt ;
    @Nullable
    public Integer totalTestItem ;
    @Nullable
    public Integer waitingNum ;
    @Nullable
    public Integer progressNum ;
    @Nullable
    public Integer completeNum ;
    @Nullable
    public Integer ngNum ;

    //Option
    public List<Integer> rootOIDs ;
    public List<Integer> fromOIDs ;
    public List<Integer> toOIDs ;


    public Integer taskOrd ;
    @Nullable
    public Integer progressRate ;

    public String isSalesOrder ;
    @Nullable
    public Integer isSkipped ;
}
