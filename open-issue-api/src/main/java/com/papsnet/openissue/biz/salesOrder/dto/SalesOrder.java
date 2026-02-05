package com.papsnet.openissue.biz.salesOrder.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.papsnet.openissue.common.dto.DObject;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.apache.ibatis.type.Alias;

import java.time.LocalDateTime;
import java.util.List;

@Schema(description = "수주")
@EqualsAndHashCode(callSuper = true)
@Data
@Alias("salesOrder")
public class SalesOrder extends DObject {

    @Schema(description = "인터페이스 키")
    @JsonProperty("ifKey")
    private Integer ifKey;

    @Schema(description = "인터페이스 구분")
    @JsonProperty("ifGb")
    private String ifGb;

    @Schema(description = "원본 OID")
    @JsonProperty("fromOid")
    private Integer fromOid;

    @Schema(description = "오더번호")
    @JsonProperty("obNo")
    private String obNo;

    @Schema(description = "프로그램 코드")
    @JsonProperty("programCd")
    private String programCd;

    @Schema(description = "프로그램 명")
    @JsonProperty("programNm")
    private String programNm;

    @Schema(description = "제품군 코드")
    @JsonProperty("itemGroupCd")
    private String itemGroupCd;

    @Schema(description = "제품군 명")
    @JsonProperty("itemGroupNm")
    private String itemGroupNm;

    @Schema(description = "분류 코드")
    @JsonProperty("itemTypeCd")
    private String itemTypeCd;

    @Schema(description = "분류 명")
    @JsonProperty("itemTypeNm")
    private String itemTypeNm;

    @Schema(description = "OEM 명")
    @JsonProperty("oemNm")
    private String oemNm;

    @Schema(description = "고객사 명")
    @JsonProperty("customerNm")
    private String customerNm;

    @Schema(description = "상태 코드")
    @JsonProperty("statusCd")
    private String statusCd;

    @Schema(description = "상태 명")
    @JsonProperty("statusNm")
    private String statusNm;

    @Schema(description = "PM(사번/UID)")
    @JsonProperty("pm")
    private Integer pm;

    @Schema(description = "PM 이름")
    @JsonProperty("pmNm")
    private String pmNm;

    @Schema(description = "타입 설명")
    @JsonProperty("typeDesc")
    private String typeDesc;

    @Schema(description = "비고")
    @JsonProperty("remark")
    private String remark;

    @Schema(description = "대표 여부/값")
    @JsonProperty("rep")
    private String rep;

    @Schema(description = "프로젝트 번호")
    @JsonProperty("pjNo")
    private String pjNo;

    @Schema(description = "프로그램 명(약식)")
    @JsonProperty("pgmNm")
    private String pgmNm;

    @Schema(description = "프로그램 코드(약식)")
    @JsonProperty("pgmCd")
    private String pgmCd;

    @Schema(description = "개발비")
    @JsonProperty("devCost")
    private Integer devCost;

    @Schema(description = "금형비")
    @JsonProperty("moldCost")
    private Integer moldCost;

    @Schema(description = "설비비")
    @JsonProperty("eqpCost")
    private Integer eqpCost;

    @Schema(description = "견적 대표자/값")
    @JsonProperty("repEstimate")
    private String repEstimate;

    @Schema(description = "하위 영업오더 목록")
    @JsonProperty("children")
    private List<SalesOrder> children;

    @Schema(description = "ERP OID")
    @JsonProperty("erpOid")
    private Integer erpOid;

    // 추가 필드 (프로그램/제품군/분류/OEM/고객사/PM/템플릿)
    @Schema(description = "OEM OID")
    @JsonProperty("oemOid")
    private Integer oemOid;

    @Schema(description = "차종 OID")
    @JsonProperty("carOid")
    private Integer carOid;

    @Schema(description = "아이템 OID")
    @JsonProperty("itemOid")
    private Integer itemOid;

    @Schema(description = "아이템 분류 OID")
    @JsonProperty("itemClassOid")
    private Integer itemClassOid;

    @Schema(description = "고객사 OID")
    @JsonProperty("customerOid")
    private Integer customerOid;

    @Schema(description = "PM OID")
    @JsonProperty("pmOid")
    private Integer pmOid;

    @Schema(description = "템플릿 OID")
    @JsonProperty("templateOid")
    private Integer templateOid;

    // WBS용 일정
    @Schema(description = "예상 시작일시")
    @JsonProperty("estStartDt")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime estStartDt;

    @Schema(description = "예상 종료일시")
    @JsonProperty("estEndDt")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime estEndDt;

    @Schema(description = "예상 기간(일)")
    @JsonProperty("estDuration")
    private Integer estDuration;

    @Schema(description = "실제 시작일시")
    @JsonProperty("actStartDt")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actStartDt;

    @Schema(description = "실제 종료일시")
    @JsonProperty("actEndDt")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime actEndDt;

    @Schema(description = "작업일수")
    @JsonProperty("workingDay")
    private Integer workingDay;

    @Schema(description = "캘린더 OID")
    @JsonProperty("calendarOid")
    private Integer calendarOid;

    @Schema(description = "캘린더 객체")
    @JsonProperty("calendar")
    private Object calendar; // ← 프로젝트의 실제 Calendar DTO로 교체하세요.

    @Schema(description = "완료율/완료여부")
    @JsonProperty("complete")
    private Integer complete;

    @Schema(description = "실제 기간(일)")
    @JsonProperty("actDuration")
    private Integer actDuration;

    // 기타
    @Schema(description = "프로젝트 관리번호")
    @JsonProperty("projectManageOid")
    private String projectManageOid;

    @Schema(description = "프로젝트 OID")
    @JsonProperty("projectOid")
    private Integer projectOid;

    @Schema(description = "프로젝트 명")
    @JsonProperty("projectNm")
    private String projectNm;
}
