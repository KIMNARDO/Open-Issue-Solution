package com.papsnet.openissue.biz.openIssue.dao;

import com.papsnet.openissue.biz.openIssue.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface OpenIssueDAO {
    OpenIssue selOpenIssue(OpenIssue issue);
    public List<OpenIssue> selAllOpenIssue(OpenIssue issue);
    public List<OpenIssueRelationship> selectRelationshipByCondition(OpenIssueRelationship relationship);

	//TODO
	public List<OpenIssue> searchOpenIssue(OpenIssue issue);

    public Integer insOpenIssue(OpenIssue issue);
    public Integer updateOpenIssue(OpenIssue issue);
    public Integer updateOpenIssueIsNull(OpenIssue issue);

    public Integer insertDopenissueRelationship(OpenIssueRelationship relationship);
    public Integer insertDopenissueRelationshipBatch(List<OpenIssueRelationship> list);
    public Integer deleteDopenissueRelationship(int oid);
    public Integer deleteRelationsByFromAndType(OpenIssueRelationship relationship);
    int updateOpenIssueRelationship(OpenIssueRelationship cond);
    int deleteOpenIssueRelationship(OpenIssueRelationship cond);

    public Integer deleteOpenIssue(int oid);
    public Integer deleteOpenIssueBatch(List<Integer> fromOIDs);

    public OpenIssueGroupDef selectDopenissueGroupDef(@Param("openIssueGroup") Integer openIssueGroup, @Param("groupName") String groupName);
    public Integer selectDopenissueGroupDefCount(Integer openIssueGroup);

    public Integer updateDopenissueGroupDef(@Param("openIssueGroup") Integer openIssueGroup, @Param("groupName") String groupName);
    public Integer insertDopenissueGroupDef(@Param("openIssueGroup") Integer openIssueGroup, @Param("groupName") String groupName);

    OpenIssueGroupDef selectOpenIssueGroupDefById(Integer oid);
    OpenIssueGroupDef selectOpenIssueGroupDefByData(OpenIssueGroupDef data);
    List<OpenIssueGroupDef> selectOpenIssueGroupDefList(OpenIssueGroupDef data);
    int insertOpenIssueGroupDef(OpenIssueGroupDef data);
    int updateOpenIssueGroupDef(OpenIssueGroupDef data);

    int insertOpenIssueComment(OpenIssueComment data);
    int updateOpenIssueComment(OpenIssueComment data);
    List<OpenIssueComment> selectOpenIssueCommentList(OpenIssueComment data);
    OpenIssueComment selectOpenIssueComment(OpenIssueComment data);
    int deleteOpenIssueComment(OpenIssueComment data);

    List<OpenIssueGroupCategory> selectOpenIssueGroupCategoryList(OpenIssueGroupCategory cond);
    OpenIssueGroupCategory selectOpenIssueGroupCategory(OpenIssueGroupCategory cond);
    int insertOpenIssueGroupCategory(OpenIssueGroupCategory cond);
    int updateOpenIssueGroupCategory(OpenIssueGroupCategory cond);
    int deleteOpenIssueGroupCategory(OpenIssueGroupCategory cond);
}
