package com.papsnet.openissue.biz.project.dto;

import com.papsnet.openissue.common.dto.DObject;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class PmsProject extends DObject {
    public String projectType ;

    public String isTemplate ;
    public String isSalesOrder ;

    @Nullable
    public Date baseDt ;
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
    public Integer workingDay ;
    @Nullable
    public Integer calendarOID ;

//    public Calendar Calendar ;
    @Nullable
    public Integer complete ;
    @Nullable
    public Integer pmOID ;

    public String pmNm ;
    @Nullable
    public Integer templateOID ;
    @Nullable
    public Integer baseProjectOID ;
    @Nullable
    public Date estDisposalDt ;
    @Nullable
    public Date massProdDt ;
    @Nullable
    public Date disconDt ;

    //프로젝트 템플릿 내용
    public String templateContent ;
    @Nullable
    public Integer oemLibOID ;
    @Nullable
    public Integer carLibOID ;
    @Nullable
    public Integer itemNo ;
    @Nullable
    public Integer itemMiddle ;

    public String projectGrade ;
    @Nullable
    public Integer customerOID ;

    public String productNm ;

    public String oemLibNm ;

    public String carLibNm ;

    public String itemNoNm ; //ITEM_NO

    public String itemMiddleNm ;

    public String customerNm ;

    //도낫 차트 집계용 수량
    @Nullable
    public Integer count ;

    //대시보드용 선언

    public List<Integer> gatePolicy ;
    public List<Double> gatePercent ;
    @Nullable
    public Integer totalCnt ;
    @Nullable
    public Integer prepareCnt ;
    @Nullable
    public Integer processCnt ;
    @Nullable
    public Integer delayCnt ;
    @Nullable
    public Integer startCnt ;
    @Nullable
    public Integer completeCnt ;
    @Nullable
    public Integer delayCompleteCnt ;
    @Nullable
    public Integer issueCnt ;
    @Nullable
    public Integer pausedCnt ;
    @Nullable
    public Integer gateReviewCnt ;
    @Nullable
    public Double directRate ;


    public List<String> date ;
    public List<Integer> prepare ;
    public List<Integer> delay ;
    public List<Integer> start ;

    public String forecast ;
    public String wrCreateStore ;
    public String chartDate ;

    //멤버
//    public List<PmsRelationship> Members ;

    //비용
    @Nullable
    public BigDecimal devCost ;
    @Nullable
    public BigDecimal moldCost ;
    @Nullable
    public BigDecimal equipCost ;
    @Nullable
    public BigDecimal targetCost ;
    public String standardCostColor ;

    //진척률
    @Nullable
    public Integer progressRate ;
    public Integer detailStatus ;

    //영업 수주 관리
    @Nullable
    public Integer salesOrderOID ;
    public String salesOrderNm ;
    public List<Integer> salesOrderOIDs ;
    public String salesOrderOBNO ;

    //전송할 데이터 
    public String itemGroupCd ;

    //설계변경 연결
    public String isChangeOrder ;

    //대시 보드
    public List<PmsProjectDashboard> pmsDashboard ;
}


