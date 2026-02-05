package com.papsnet.openissue.biz.openIssue.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.papsnet.openissue.common.dto.DObject;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.Arrays;
import java.util.Date;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
@SuperBuilder
public class OpenIssue extends DObject {

    @Nullable
    public Integer rootOID;
    @Nullable
    public Integer fromOID;
    public Integer projectOID;
    @Nullable
    public String projectType;
    public String projectNm;
    public String oemLibNm;
    public String carLibNm;
    public String taskNm;
    @Nullable
    public String category;
    public String itemNm;
    @Nullable
    public Integer importance;
    public Date estFinDt;
    @Nullable
    public Integer managerOID;
    public String managerNm;
    @Nullable
    public List<Integer> issueManagers;
    public String issueManagerNm;

    public List<Integer> managers;
    public String contents;

    @Nullable
    public Date finDt;
    @Nullable
    public Date strDt;
    public String isApprovalRequired;
    public String issueType;
    @Nullable
    public Integer taskOID;
    public String issueTypeNm;

    //in SQL
//    public String getIssueTypeNm() {
//        if (this.issueType != null && !this.issueType.isEmpty())
//        {
//            Integer? issueTypeOID = LibraryRepository.selSingleLibrary(new Library { KorNm = PmsConstant.ATTRIBUTE_ISSUE_TYPE }).OID;
//            List<Library> list = LibraryRepository.SelLibraryObjects(new Library { }).FindAll(issue => issue.FromOID == issueTypeOID);
//            String[] arrReason = this.IssueType.IndexOf(',') > -1 ? this.IssueType.Split(',') : new String[] { this.IssueType };
//            String returnVal = "";
//
//            if(list != null && list.Count > 0)
//            {
//                foreach (String arrVal in arrReason)
//                {
//                    returnVal += list.Find(f => f.OID.ToString() == arrVal).KorNm + ", ";
//                }
//            }
//            return returnVal.SubString(0, returnVal.LastIndexOf(", "));
//        }
//        else
//        {
//            return "";
//        }
//    }

    public String[] issueTypeList;
    public String[] getIssueTypeList() {
        if (this.issueType != null && this.issueType.isEmpty())
        {
            String[] arrReason = this.issueType.indexOf(',') > -1 ? this.issueType.split(",") : new String[] {this.issueType};

            return arrReason;
        }
        else
        {
            return null;
        }
    };

    public String importanceNm;
    public String getImportanceNm() {
        if (this.importance != null && this.importance > 0)
        {
            String returnVal = "";
            switch (importance)
            {
                case 5: returnVal = "긴급"; break;
                case 4: returnVal = "지시사항"; break;
                case 3: returnVal = "상"; break;
                case 2: returnVal = "중"; break;
                case 1: returnVal = "하"; break;
                default: returnVal = ""; break;
            }
            return returnVal;
        }
        else
        {
            return "";
        }
    }


//    public List<HttpPostedFileBase> Files ;

//    public List<HttpFile> delFiles ;
    public Integer fileUse ;
    public Integer improvementFileUse ;

    @Nullable
    public Integer gateOID ;
    @Nullable
    public Integer gate ;
    public String gateName ;
    @Nullable
    public Integer gateNum ;
    @Nullable
    public Date rejectDt ;
    @Nullable
    public Integer ecoOID ;
    public String ecoNo ;
    public String ecoNm ;
    public String ecoStatus ;
    public String placeOfIssue ; // 발생처
    public String placeOfIssueNm ; // 발생처
    public String issueTypeB ; //기구 HW SW
    public String[] issueTypeBList ;
    public String issueTypeBNm ; //기구 HW SW
    @Nullable
    public Date dueDt ; //Due Date
    public String management ;//경영진 보고
    public Integer issueState ; //이슈 상태
    public String issueStateNm ; //이슈 상태
//    public List<HttpPostedFileBase> ImprovementFiles ;
//    public List<HttpFile> ImprovementDelFiles ;
    public Integer reportOID ;
    public String reportNm ;

    @Nullable
    public Date sop;
    @Nullable
    public Integer productionSite;
    @Nullable
    public String replaceMembers;
    @Nullable
    public String remark;

    @Schema(description = "(신규추가) 오픈 이슈 담당자")
    @JsonProperty("openIssueManager")
    private List<OpenIssueRelationship> openIssueManager;

    @Schema(description = "개발 OIL 부서별 OIL")
    @JsonProperty("openIssueType")
    private String openIssueType;

    @Schema(description = "assignedTo")
    @JsonProperty("assignedTo")
    private String assignedTo;

    @Schema(description = "volum")
    @JsonProperty("volum")
    private String volum;

    @Schema(description = "salesYear")
    @JsonProperty("salesYear")
    private String salesYear;

    @Schema(description = "부서별 프로젝트 명")
    @JsonProperty("deptProjectNm")
    private String deptProjectNm;

    @Schema(description = "부서별 제품군 명")
    @JsonProperty("deptItemNm")
    private String deptItemNm;

    @Schema(description = "부서별 고객사 명")
    @JsonProperty("deptCustomerNm")
    private String deptCustomerNm;

    @Schema(description = "오픈이슈 그룹키")
    @JsonProperty("openIssueGroup")
    private Integer openIssueGroup;

    @Schema(description = "오픈이슈 그룹키 LIST(검색)")
    @JsonProperty("openIssueGroupList")
    private List<Integer> openIssueGroupList;

    @Schema(description = "오픈이슈 카테고리 키 (오픈이슈 NAME)")
    @JsonProperty("openIssueCategoryOid")
    private Integer openIssueCategoryOid;

    @Schema(description = "오픈이슈 카테고리 명 (오픈이슈 NAME)")
    @JsonProperty("openIssueCategoryName")
    private String openIssueCategoryName;

    @Schema(description = "오픈이슈 CLOSE 날짜")
    @JsonProperty("closeDt")
    private String closeDt;

    @Schema(description = "오픈이슈 재시작 날짜")
    @JsonProperty("reStartDt")
    private String reStartDt;

    @Schema(description = "지연일")
    @JsonProperty("delayDt")
    private Integer delayDt;

    @Schema(description = "파일 여부")
    @JsonProperty("isFileYn")
    private String isFileYn;

    @Schema(description = "코멘트 여부")
    @JsonProperty("isCommentYn")
    private String isCommentYn;

    @Schema(description = "그룹 카테고리 키")
    @JsonProperty("groupCategoryOid")
    private Integer groupCategoryOid;

    @Schema(description = "그룹 카테고리")
    @JsonProperty("groupCategoryNm")
    private String groupCategoryNm;

    @Schema(description = "이슈 NO")
    @JsonProperty("issueNo")
    private Integer issueNo;

    @Schema(description = "searchWord")
    @JsonProperty("searchWord")
    private String searchWord;
}
