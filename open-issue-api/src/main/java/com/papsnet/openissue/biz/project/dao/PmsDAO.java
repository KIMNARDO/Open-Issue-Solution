package com.papsnet.openissue.biz.project.dao;

import com.papsnet.openissue.biz.project.dto.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PmsDAO {
    // Existing PMS base methods
    List<PmsProject> selPmsProject(PmsProject pjt);
    int selPmsProjectCount(PmsProject pjt);
    PmsProject selPmsProjectObject(PmsProject pjt);
    List<PmsProject> selLibDelCheckPms(PmsProject pjt);
    List<PmsProject> selTempPmsProject(PmsProject pjt);
    int selTempPmsProjectCount(PmsProject pjt);
    List<PmsProject> selChangePmObjects();
    Integer udtPmsGateSignOffProject(PmsProject project);

    // Additional project queries
    List<PmsProject> selOemBPolicy(PmsProject param);

    List<PmsRelationship> selPmsRelationship(PmsRelationship rel);
    List<PmsProcess> selPmsProcess(PmsProcess process);

    List<PmsWbs> selPmsWbs(PmsWbs wbs);
    List<PmsWbsMember> selPmsWbsMember(PmsWbsMember wbs);

    Integer insPmsRelationship(PmsRelationship rel);
    Integer insPmsRelationshipNotOrd(PmsRelationship rel);
    Integer insPmsProject(PmsProject project);
    Integer udtPmsProject(PmsProject project);
    Integer insPmsProcess(PmsProcess process);
    Integer udtPmsProcess(PmsProcess process);
    Integer udtPmsProcessDependency(PmsProcess process);

    // Baseline
    Integer insPmsBaseLineProject(PmsBaseLineProject param);
    List<PmsBaseLineProject> selPmsBaseLineProject(PmsBaseLineProject param);
    Integer insPmsBaseLineProcess(PmsBaseLineProcess param);
    List<PmsBaseLineProcess> selPmsBaseLineProcess(PmsBaseLineProcess param);
    Integer insPmsBaseLineRelationship(PmsBaseLineRelationship param);
    List<PmsBaseLineRelationship> selPmsBaseLineRelationship(PmsBaseLineRelationship param);

    // Relationship maintenance
    Integer delPmsRelationship(PmsRelationship rel);
    Integer pmsMemberReset(PmsRelationship rel);
    Integer delPmsRelationshipByData(PmsRelationship rel);
    Integer udtPmsRelationship(PmsRelationship rel);
    Integer udtPmsRelationshipByToOID(PmsRelationship rel);
    List<PmsRelationship> selPmsDocRelationship(PmsRelationship rel);
    List<PmsRelationship> selPmsRelationshipTaskIsNull(PmsRelationship rel);
    List<PmsRelationship> viewWbsPmsRelation(PmsRelationship rel);
    List<PmsRelationship> recursionPmsRelation(PmsRelationship rel);

    // Merged from PmsExtDAO
    // EPL
    List<PmsEPL> selEPL(PmsEPL param);
    PmsEPL selEPLObject(PmsEPL param);
    Integer insEPL(PmsEPL param);
    Integer udtEPL(PmsEPL param);
    Integer udtEPLProjectProgram(PmsEPL param);

    List<PmsEPLItem> selEPLItem(PmsEPLItem param);
    PmsEPLItem selEPLItemObject(PmsEPLItem param);
    Integer selEPLItemCheck(PmsEPLItem param);
    List<PmsEPLItem> selByColumnNameEplItem(PmsEPLItem param);
    Integer insEPLItem(PmsEPLItem param);
    Integer udtEPLItem(PmsEPLItem param);
    Integer udtEPLItemRow(PmsEPLItem param);
    Integer udtEPLItemFile(PmsEPLItem param);
    Integer delEPLItem(PmsEPLItem param);

    List<PmsEPLSpec> selEPLSpec(PmsEPLSpec param);
    PmsEPLSpec selEPLSpecObject(PmsEPLSpec param);
    Integer insEPLSpec(PmsEPLSpec param);
    Integer udtEPLSpec(PmsEPLSpec param);
    List<PmsEPLSpec> selEPLSpecEstimatorNumber(PmsEPLSpec param);

    // Reliability
    List<PmsReliability> selPmsReliability(PmsReliability param);
    PmsReliability selPmsReliabilityObject(PmsReliability param);
    Integer insPmsReliability(PmsReliability param);
    Integer udtPmsReliability(PmsReliability param);

    // Reliability Test Item List
    Integer insPmsReliabilityItemList(PmsReliabilityItemList param);
    List<PmsReliabilityItemList> selPmsReliabilityItemList(PmsReliabilityItemList param);
    Integer delTestItemList(PmsReliabilityItemList param);

    // Reliability Report
    List<PmsReliabilityReport> selPmsReliabilityReport(PmsReliabilityReport param);
    PmsReliabilityReport selPmsReliabilityReportObject(PmsReliabilityReport param);
    Integer insPmsReliabilityReport(PmsReliabilityReport param);
    Integer udtPmsReliabilityReport(PmsReliabilityReport param);

    // Reliability Report Item List
    Integer insPmsReliabilityReportItemList(PmsReliabilityReportItemList param);
    List<PmsReliabilityReportItemList> selPmsReliabilityReportItemList(PmsReliabilityReportItemList param);
    Integer delReportTestItemList(PmsReliabilityReportItemList param);

    // Gate
    List<PmsGateMetting> selPmsGateMetting(PmsGateMetting param);
    PmsGateMetting selPmsGateMettingObject(PmsGateMetting param);

    PmsGateSignOff selPmsGateSignOff(PmsGateSignOff param);
    Integer insPmsGateSignOff(PmsGateSignOff param);
    Integer udtPmsGateSignOff(PmsGateSignOff param);

    Integer insPmsGateSignOffCost(PmsGateSignOffCost param);
    List<PmsGateSignOffCost> selPmsGateSignOffCost(PmsGateSignOffCost param);
    PmsGateSignOffCost selPmsGateSignOffCostObject(PmsGateSignOffCost param);
    Integer delPmsGateSignOffCost(PmsGateSignOffCost param);

    // Issue Comment
    Integer insPmsIssueComment(PmsIssueComment param);
    List<PmsIssueComment> selPmsIssueComment(PmsIssueComment param);

    // New CheckList
    List<PmsNewCheckList> selPmsNewCheckList(PmsNewCheckList param);
    Integer insPmsNewCheckList(PmsNewCheckList param);
    Integer udtPmsNewCheckList(PmsNewCheckList param);

    // Customer Schedule
    List<CustomerSchedule> selProjMngtCustomerSchedule(CustomerSchedule param);
    Integer insProjMngtCustomerSchedule(CustomerSchedule param);
    Integer delProjMngtCustomerSchedule(CustomerSchedule param);
    Integer insProjectCustomerSchedule(CustomerSchedule param);
    Integer udtProjectCustomerSchedule(CustomerSchedule param);
}
