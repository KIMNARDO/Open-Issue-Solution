package com.papsnet.openissue.biz.openIssue.service;

import com.papsnet.openissue.auth.dao.PersonDAO;
import com.papsnet.openissue.auth.dao.UserDAO;
import com.papsnet.openissue.auth.dto.Person;
import com.papsnet.openissue.auth.service.PersonService;
import com.papsnet.openissue.biz.openIssue.dao.OpenIssueDAO;
import com.papsnet.openissue.biz.openIssue.dto.*;
import com.papsnet.openissue.biz.project.dao.PmsDAO;
import com.papsnet.openissue.biz.project.dto.PmsProject;
import com.papsnet.openissue.biz.project.dto.PmsRelationship;
import com.papsnet.openissue.biz.project.service.PmsAuthService;
import com.papsnet.openissue.biz.salesOrder.dto.SalesOrder;
import com.papsnet.openissue.biz.salesOrder.service.SalesOrderService;
import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.constant.PmsConstant;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dao.DLibraryDAO;
import com.papsnet.openissue.common.dto.*;
import com.papsnet.openissue.common.exception.*;
import com.papsnet.openissue.common.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OpenIssueService {
    private final OpenIssueDAO openIssueDAO;
    private final DLibraryDAO dLibraryDAO;
    private final PmsDAO pmsDAO;
    private final PersonDAO personDAO;
    private final CommonDAO commonDAO;
    private final SalesOrderService salesOrderService;
    private final UserDAO userDAO;
    private final DObjectService dObjectService;
    private final BPolicyService bpolicyService;
    private final PmsAuthService pmsAuthService;
    private final BPolicyAuthService bPolicyAuthService;
    private final PersonService personService;
    private final DLibraryService dLibraryService;
    private final MailService mailService;
    private final HttpFileService httpFileService;

    public List<FolderResult<Object>> findMenuList(String type, int reqUserUid) {
        try {
            DLibrary param = new DLibrary();
            param.setFromOID(CommonConstant.OPENISSUETYPE_OID);
            param.setName(type);

            DLibrary openIssueType = dLibraryDAO.selSingleLibrary(param);

            List<FolderResult<Object>> resultList = new ArrayList<>();
            if (openIssueType != null) {
                if (Objects.equals(openIssueType.getName(), "DEV")) {
                    FolderResult<Object> ptc = createNode("1", "PTC", "TYPE");
                    FolderResult<Object> actuator = createNode("2", "Actuator", "TYPE");
                    FolderResult<Object> control = createNode("3", "Control", "TYPE");
                    FolderResult<Object> clutchCoil = createNode("4", "Clutch Coil", "TYPE");
                    FolderResult<Object> sensor = createNode("5", "Sensor", "TYPE");
                    FolderResult<Object> value = createNode("6", "Value", "TYPE");
                    FolderResult<Object> etc = createNode("7", "기타", "TYPE");

                    List<FolderResult<Object>> ptcChildren = new ArrayList<>();
                    List<FolderResult<Object>> actuatorChildren = new ArrayList<>();
                    List<FolderResult<Object>> controlChildren = new ArrayList<>();
                    List<FolderResult<Object>> clutchCoilChildren = new ArrayList<>();

                    FolderResult<Object> node10 = createNode("10", "Program A", "PROJECT");
                    FolderResult<Object> node11 = createNode("11", "Program B", "PROJECT");
                    ptcChildren.add(node10);
                    ptcChildren.add(node11);

                    FolderResult<Object> node20 = createNode("20", "Program C", "PROJECT");
                    FolderResult<Object> node21 = createNode("21", "Program D", "PROJECT");
                    actuatorChildren.add(node20);
                    actuatorChildren.add(node21);

                    FolderResult<Object> node30 = createNode("30", "Program E", "PROJECT");
                    controlChildren.add(node30);

                    FolderResult<Object> node40 = createNode("40", "Program F", "PROJECT");
                    clutchCoilChildren.add(node40);

                    ptc.setChildren(ptcChildren);
                    actuator.setChildren(actuatorChildren);
                    control.setChildren(controlChildren);
                    clutchCoil.setChildren(clutchCoilChildren);

                    resultList.add(ptc);
                    resultList.add(actuator);
                    resultList.add(control);
                    resultList.add(clutchCoil);
                    resultList.add(sensor);
                    resultList.add(value);
                    resultList.add(etc);
                } else if (Objects.equals(openIssueType.getName(), "DEPT")) {
                    OpenIssueGroupDef paramGroupDef = new OpenIssueGroupDef();
                    paramGroupDef.setType(CommonConstant.TYPE_OPENISSUEGROUP);
                    paramGroupDef.setGroupType(openIssueType.getName());
                    List<OpenIssueGroupDef> openIssueMenuList = openIssueDAO.selectOpenIssueGroupDefList(paramGroupDef);
                    if (openIssueMenuList != null && !openIssueMenuList.isEmpty()) {
                        openIssueMenuList = openIssueMenuList.stream().filter(f -> f.getFromOid() == null).toList();
                        for (OpenIssueGroupDef data : openIssueMenuList) {
                            // Top-level department/type node
                            String key = String.valueOf(data.getOid());
                            String title = data.getName();
                            FolderResult<Object> top = createNode(key, title, "DEPT");

                            OpenIssueGroupDef childParam = new OpenIssueGroupDef();
                            childParam.setFromOid(data.getOid());
                            childParam.setType(CommonConstant.TYPE_OPENISSUEGROUP);
                            List<OpenIssueGroupDef> children = findOpenIssueGroupDefList(childParam, reqUserUid);
                            if (children != null && !children.isEmpty()) {
                                List<FolderResult<Object>> childNodes = new ArrayList<>();
                                for (OpenIssueGroupDef child : children) {
                                    String cKey = String.valueOf(child.getOid());
                                    String cTitle = child.getName();
                                    FolderResult<Object> childNode = createNode(cKey, cTitle, "DEPT");
                                    childNodes.add(childNode);
                                }
                                top.setChildren(childNodes);
                            }
                            if (top.getChildren() != null && !top.getChildren().isEmpty()) {
                                resultList.add(top);
                            }
                        }
                    }
                } else if (Objects.equals(openIssueType.getName(), "CORP")) {
                    OpenIssueGroupDef paramGroupDef = new OpenIssueGroupDef();
                    paramGroupDef.setType(CommonConstant.TYPE_OPENISSUEGROUP);
                    paramGroupDef.setGroupType(openIssueType.getName());

                    List<OpenIssueGroupDef> openIssueMenuList = openIssueDAO.selectOpenIssueGroupDefList(paramGroupDef);
                    if (openIssueMenuList != null && !openIssueMenuList.isEmpty()) {
                        for (OpenIssueGroupDef data : openIssueMenuList) {
                            // Top-level department/type node
                            String key = String.valueOf(data.getOid());
                            String title = data.getName();
                            FolderResult<Object> top = createNode(key, title, "CORP");

                            // Fetch children projects/items under this node
                            OpenIssueGroupDef childParam = new OpenIssueGroupDef();
                            childParam.setFromOid(data.getOid());
                            childParam.setType(CommonConstant.TYPE_OPENISSUEGROUP);
                            List<OpenIssueGroupDef> children = openIssueDAO.selectOpenIssueGroupDefList(childParam);
                            if (children != null && !children.isEmpty()) {
                                List<FolderResult<Object>> childNodes = new ArrayList<>();
                                for (OpenIssueGroupDef child : children) {
                                    String cKey = String.valueOf(child.getOid());
                                    String cTitle = child.getName();
                                    FolderResult<Object> childNode = createNode(cKey, cTitle, "CORP");
                                    childNodes.add(childNode);
                                }
                                top.setChildren(childNodes);
                            }

                            resultList.add(top);
                        }
                    }
                }
            }
            return resultList;
        } catch (Exception e) {
            log.error("문서 목록 조회 중 오류 발생", e);
            return null;
        }
    }

    private FolderResult<Object> createNode(String key, String title, String type) {
        FolderResult<Object> node = new FolderResult<>();
        node.setKey(key);
        node.setTitle(title);
        node.setType(type);
        node.setData(null);
        return node;
    }

    private void bindProjectData(OpenIssue i, List<Integer> projectOIDs) {
        if (i.getProjectType() != null && i.getProjectType().equals("SALES")) {
            SalesOrder salesCond = new SalesOrder();
            salesCond.setOid(i.getProjectOID());
            SalesOrder currentSalesOrder = salesOrderService.findSalesOrders(salesCond).stream().max(Comparator.comparing(SalesOrder::getIfKey)).orElse(null);


            if (currentSalesOrder != null) {
                //pjtNm
                i.setProjectNm(currentSalesOrder.getName());
                // oem
                i.setOemLibNm(currentSalesOrder.getCustomerNm());
                // item
                i.setItemNm(currentSalesOrder.getItemTypeNm());
            }
        } else {
            List<DLibrary> oemList = dLibraryDAO.selCodeLibrary(DLibrary.builder().fromOID(CommonConstant.OEM_OID).build());
            List<DLibrary> itemList = dLibraryDAO.selCodeLibrary(DLibrary.builder().fromOID(CommonConstant.ITEM_GROUP_OID).build());
            List<PmsProject> projectList = pmsDAO.selPmsProject(PmsProject.builder().oids(projectOIDs).build());

            // pjt
            PmsProject currentProject = projectList.stream().filter(pjt -> pjt.getOid().equals(i.getProjectOID())).findFirst().orElse(null);
            if (currentProject != null) {
                //pjtNm
                i.setProjectNm(currentProject.getName());
                // oem
                DLibrary currentOem = oemList.stream().filter(oem -> oem.getOid().equals(currentProject.getOemLibOID())).findFirst().orElse(null);
                if (currentOem != null) {
                    i.setOemLibNm(currentOem.getKorNm());
                }
                // item
                DLibrary currentItem = itemList.stream().filter(item -> item.getOid().equals(currentProject.getItemNo())).findFirst().orElse(null);
                if (currentItem != null) {
                    i.setItemNm(currentItem.getKorNm());
                }
            }
        }
    }

	//TODO
	public List<OpenIssue> searchIssue(OpenIssue issue) throws Exception {
		issue.setType(PmsConstant.TYPE_ISSUE_PROJECT);

		List<OpenIssue> duplicateIssueList = openIssueDAO.searchOpenIssue(issue);

		List<OpenIssue> issueList = duplicateIssueList.stream()
			.collect(Collectors.toMap(
				OpenIssue::getOid,
				i -> i,
				(existing, duplicate) -> existing,
				LinkedHashMap::new
			))
			.values()
			.stream()
			.collect(Collectors.toList());


		DLibrary param = new DLibrary();
		param.setTableNm(CommonConstant.TABLE_LIBRARY);
		param.setType(CommonConstant.TYPE_LIBRARY);
		List<DLibrary> dLibraryList = dLibraryDAO.selLibrary(param);
		Integer issueStateOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(PmsConstant.ATTRIBUTE_ISSUE_STATE).build()).getOid();
		Integer issuePlaceOfIssueOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(PmsConstant.ATTRIBUTE_ISSUE_PLACEOFISSUE).build()).getOid();

		// lists
		List<DLibrary> issueStateList = dLibraryDAO.selLibrary(DLibrary.builder().fromOID(issueStateOID).build());
		List<DLibrary> issuePlaceofIssueList = dLibraryDAO.selLibrary(DLibrary.builder().fromOID(issuePlaceOfIssueOID).build());
		List<Person> userList = personDAO.selPerson(new Person());

		// project
		List<Integer> issueOIDs = issueList.stream().map(OpenIssue::getOid).toList();
		List<Integer> pjtOIDs = issueList.stream().map(OpenIssue::getProjectOID).toList();

		List<OpenIssueRelationship> issueManagerList =
			openIssueDAO.selectRelationshipByCondition(OpenIssueRelationship.builder().fromOIDs(issueOIDs).type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER).build());

		//-------------------------------------------
		issueList.forEach(i -> {
			HttpFile fileParam = new HttpFile();
			fileParam.setOid(i.getOid());
			fileParam.setType(i.getType());
			List<HttpFile> fileList = httpFileService.selFiles(fileParam);
			if(fileList != null && !fileList.isEmpty()) {
				if(fileList.size() > 0) {
					i.setIsFileYn("Y");
				}
			}
			OpenIssueComment commentParam = new OpenIssueComment();
			commentParam.setOpenIssueOid(i.getOid());
			List<OpenIssueComment> commentList = openIssueDAO.selectOpenIssueCommentList(commentParam);
			if(commentList != null && !commentList.isEmpty()) {
				if(commentList.size() > 0) {
					i.setIsCommentYn("Y");
				}
			}
			// issueTypeNm
			//            StringBuilder issueTypeNm = new StringBuilder();
			//            String[] issueTypes = new String[] {};
			//            if(i.getIssueType() != null) {
			//                issueTypes =  i.getIssueType().lastIndexOf(",") > -1 ? i.getIssueType().split(",") : new String[] {i.getIssueType()};
			//            }
			//            for(String type: issueTypes) {
			//                issueTypeNm.append(issueTypeList.stream().filter(t -> t.getOid().toString().equals(type)).findAny().get().getKorNm() + ",");
			//            }
			//            if(issueTypeNm.length() > 1) {
			//                issueTypeNm.deleteCharAt(issueTypeNm.length() -1);
			//            }
			//            i.setIssueTypeNm(issueTypeNm.toString());

			// issueState
			DLibrary issueState = issueStateList.stream().filter(state -> state.getOid().toString().equals(i.getIssueState())).findFirst().orElse(null);
			if (issueState != null) {
				i.setIssueStateNm(issueState.getKorNm());
			}
			// issuePlaceOfIssue
			DLibrary placeOfIssue = issuePlaceofIssueList.stream().filter(poi -> poi.getOid().toString().equals(i.getPlaceOfIssue())).findFirst().orElse(null);
			if (placeOfIssue != null) {
				i.setPlaceOfIssueNm(placeOfIssue.getKorNm());
			}

			bindProjectData(i, pjtOIDs);

			// issueManager
			//            StringBuilder issueManagerNm = new StringBuilder();
			List<Integer> issueManagerOIDs = issueManagerList.stream().filter(m -> Objects.requireNonNull(m.getFromOID()).equals(i.getOid())).map(OpenIssueRelationship::getToOID).toList();
			List<Integer> issueManagers = userList.stream().map(Person::getOid).filter(issueManagerOIDs::contains).toList();
			if (issueManagers != null) {
				i.setIssueManagers(issueManagers);
			}

			List<OpenIssueRelationship> getMemberList = new ArrayList<>();
			// Build member list for the current issue (fromOID == issue OID)
			for (OpenIssueRelationship memberData : issueManagerList) {
				if (memberData == null || !Objects.equals(memberData.getFromOID(), i.getOid())) continue;

				// Find the person in userList whose oid matches memberData.toOID
				Person tmpPerson = userList.stream()
					.filter(u -> u != null && Objects.equals(u.getOid(), memberData.getToOID()))
					.findFirst()
					.orElse(null);

				if (tmpPerson != null) {
					memberData.setPersonNm(tmpPerson.getName());
					memberData.setDepartmentNm(tmpPerson.getDepartmentNm());
					memberData.setJobTitleOrd(tmpPerson.getJobTitleOrd());
					memberData.setJobTitleNm(tmpPerson.getJobTitleNm());
					memberData.setEmail(tmpPerson.getEmail());
					memberData.setThumbnail(tmpPerson.getThumbnail());
				}
				getMemberList.add(memberData);
			}

			i.setOpenIssueManager(getMemberList);

			// userName
			Person userObject = userList.stream().filter(u -> Objects.equals(i.createUs, u.getOid())).findFirst().orElse(null);
			if (userObject != null) {
				i.setCreateUsNm(userObject.getName());
			}

			DLibrary openIssueCategory = dLibraryList.stream().filter(lib -> lib.getOid().equals(i.getOpenIssueCategoryOid())).findFirst().orElse(null);
			if (openIssueCategory != null) {
				i.setOpenIssueCategoryName(openIssueCategory.getKorNm());
			}

		});

		return issueList;
	}




    public List<OpenIssue> selAllIssue(OpenIssue issue) throws Exception {
        issue.setType(PmsConstant.TYPE_ISSUE_PROJECT);

        List<Integer> openIssueGroups = new ArrayList<>();
        if (issue.getOpenIssueGroup() != null && issue.getOpenIssueGroup() > 0) {
            // Collect all descendant group OIDs including the selected one
            Set<Integer> visited = new HashSet<>();
            Deque<Integer> stack = new ArrayDeque<>();
            stack.push(issue.getOpenIssueGroup());
            while (!stack.isEmpty()) {
                Integer current = stack.pop();
                if (current == null || visited.contains(current)) continue;
                visited.add(current);
                openIssueGroups.add(current);

                DLibrary param = new DLibrary();
                param.setFromOID(current);
                List<DLibrary> children = dLibraryDAO.selLibrary(param);
                if (children != null) {
                    for (DLibrary child : children) {
                        if (child != null && child.getOid() != null && !visited.contains(child.getOid())) {
                            stack.push(child.getOid());
                        }
                    }
                }
            }
            // set for mapper usage
            issue.setOpenIssueGroupList(openIssueGroups);
        }

        List<OpenIssue> issueList = openIssueDAO.selAllOpenIssue(issue);

        if (issueList.isEmpty()) return new ArrayList<>();


        // library & codeLibrary
//        Integer issueTypeOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(PmsConstant.ATTRIBUTE_ISSUE_TYPE).build()).getOid();
//        List<DLibrary> issueTypeList = dLibraryDAO.selLibrary(DLibrary.builder().fromOID(issueTypeOID).build());

        DLibrary param = new DLibrary();
        param.setTableNm(CommonConstant.TABLE_LIBRARY);
        param.setType(CommonConstant.TYPE_LIBRARY);
        List<DLibrary> dLibraryList = dLibraryDAO.selLibrary(param);
        Integer issueStateOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(PmsConstant.ATTRIBUTE_ISSUE_STATE).build()).getOid();
        Integer issuePlaceOfIssueOID = dLibraryDAO.selSingleLibrary(DLibrary.builder().korNm(PmsConstant.ATTRIBUTE_ISSUE_PLACEOFISSUE).build()).getOid();

        // lists
        List<DLibrary> issueStateList = dLibraryDAO.selLibrary(DLibrary.builder().fromOID(issueStateOID).build());
        List<DLibrary> issuePlaceofIssueList = dLibraryDAO.selLibrary(DLibrary.builder().fromOID(issuePlaceOfIssueOID).build());
        List<Person> userList = personDAO.selPerson(new Person());

        // project
        List<Integer> issueOIDs = issueList.stream().map(OpenIssue::getOid).toList();
        List<Integer> pjtOIDs = issueList.stream().map(OpenIssue::getProjectOID).toList();

        List<OpenIssueRelationship> issueManagerList =
                openIssueDAO.selectRelationshipByCondition(OpenIssueRelationship.builder().fromOIDs(issueOIDs).type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER).build());


        issueList.forEach(i -> {
            HttpFile fileParam = new HttpFile();
            fileParam.setOid(i.getOid());
            fileParam.setType(i.getType());
            List<HttpFile> fileList = httpFileService.selFiles(fileParam);
            if(fileList != null && !fileList.isEmpty()) {
                if(fileList.size() > 0) {
                    i.setIsFileYn("Y");
                }
            }
            OpenIssueComment commentParam = new OpenIssueComment();
            commentParam.setOpenIssueOid(i.getOid());
            List<OpenIssueComment> commentList = openIssueDAO.selectOpenIssueCommentList(commentParam);
            if(commentList != null && !commentList.isEmpty()) {
                if(commentList.size() > 0) {
                    i.setIsCommentYn("Y");
                }
            }
            // issueTypeNm
//            StringBuilder issueTypeNm = new StringBuilder();
//            String[] issueTypes = new String[] {};
//            if(i.getIssueType() != null) {
//                issueTypes =  i.getIssueType().lastIndexOf(",") > -1 ? i.getIssueType().split(",") : new String[] {i.getIssueType()};
//            }
//            for(String type: issueTypes) {
//                issueTypeNm.append(issueTypeList.stream().filter(t -> t.getOid().toString().equals(type)).findAny().get().getKorNm() + ",");
//            }
//            if(issueTypeNm.length() > 1) {
//                issueTypeNm.deleteCharAt(issueTypeNm.length() -1);
//            }
//            i.setIssueTypeNm(issueTypeNm.toString());

            // issueState
            DLibrary issueState = issueStateList.stream().filter(state -> state.getOid().toString().equals(i.getIssueState())).findFirst().orElse(null);
            if (issueState != null) {
                i.setIssueStateNm(issueState.getKorNm());
            }
            // issuePlaceOfIssue
            DLibrary placeOfIssue = issuePlaceofIssueList.stream().filter(poi -> poi.getOid().toString().equals(i.getPlaceOfIssue())).findFirst().orElse(null);
            if (placeOfIssue != null) {
                i.setPlaceOfIssueNm(placeOfIssue.getKorNm());
            }

            bindProjectData(i, pjtOIDs);

            // issueManager
//            StringBuilder issueManagerNm = new StringBuilder();
            List<Integer> issueManagerOIDs = issueManagerList.stream().filter(m -> Objects.requireNonNull(m.getFromOID()).equals(i.getOid())).map(OpenIssueRelationship::getToOID).toList();
            List<Integer> issueManagers = userList.stream().map(Person::getOid).filter(issueManagerOIDs::contains).toList();
            if (issueManagers != null) {
                i.setIssueManagers(issueManagers);
            }

            List<OpenIssueRelationship> getMemberList = new ArrayList<>();
            // Build member list for the current issue (fromOID == issue OID)
            for (OpenIssueRelationship memberData : issueManagerList) {
                if (memberData == null || !Objects.equals(memberData.getFromOID(), i.getOid())) continue;

                // Find the person in userList whose oid matches memberData.toOID
                Person tmpPerson = userList.stream()
                        .filter(u -> u != null && Objects.equals(u.getOid(), memberData.getToOID()))
                        .findFirst()
                        .orElse(null);

                if (tmpPerson != null) {
                    memberData.setPersonNm(tmpPerson.getName());
                    memberData.setDepartmentNm(tmpPerson.getDepartmentNm());
                    memberData.setJobTitleOrd(tmpPerson.getJobTitleOrd());
                    memberData.setJobTitleNm(tmpPerson.getJobTitleNm());
                    memberData.setEmail(tmpPerson.getEmail());
                    memberData.setThumbnail(tmpPerson.getThumbnail());
                }
                getMemberList.add(memberData);
            }

            i.setOpenIssueManager(getMemberList);

            // userName
            Person userObject = userList.stream().filter(u -> Objects.equals(i.createUs, u.getOid())).findFirst().orElse(null);
            if (userObject != null) {
                i.setCreateUsNm(userObject.getName());
            }

            DLibrary openIssueCategory = dLibraryList.stream().filter(lib -> lib.getOid().equals(i.getOpenIssueCategoryOid())).findFirst().orElse(null);
            if (openIssueCategory != null) {
                i.setOpenIssueCategoryName(openIssueCategory.getKorNm());
            }

        });

        return issueList;
    }
    
    //TODO: 오픈이슈 등록 insertOpenIssue
    @Transactional
    public List<OpenIssue> insertOpenIssues(List<OpenIssue> openIssues, int reqUserUid) throws Exception {
        if (reqUserUid < 1) {
            throw new CRequiredException();
        }
        Person reqUserData = personDAO.selPersonById(reqUserUid);
        if (reqUserData == null) {
            throw new CRequiredException();
        }

        for (OpenIssue issue : openIssues) {
            issue.setType(PmsConstant.TYPE_ISSUE_PROJECT);
            issue.setIssueState(78104);

            DObject dobj = DObject.builder()
                .type(issue.getType())
                .tableNm(PmsConstant.TABLE_ISSUE)
                .name("오픈 이슈")
                .description(issue.getDescription())
                .bpolicyOID(121)
                .createUs(reqUserUid)
                .build();
            commonDAO.insDObject(dobj);
            Integer resultOid = dobj.getOid();
            if (resultOid == null) throw new RuntimeException("등록 실패");

            issue.setOid(resultOid);
            openIssueDAO.insOpenIssue(issue);

            // 미정 기능
            // if (issue.getOpenIssueManager() != null && !issue.getOpenIssueManager().isEmpty()) {
            //     for (OpenIssueRelationship iManager : issue.getOpenIssueManager()) {
            //         OpenIssueRelationship relManager = OpenIssueRelationship.builder()
            //             .type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER)
            //             .fromOID(issue.getOid())
            //             .toOID(iManager.getToOID())
            //             .createUs(reqUserUid)
            //             .build();
            //
            //         openIssueDAO.insertDopenissueRelationship(relManager);
            //     }
            // }
            //
            // if (issue.getManagers() != null && !issue.getManagers().isEmpty()) {
            //     //            BPolicy bPolicy = commonDAO.selBPolicy(BPolicy.builder().type(issue.getType()).build());
            //     //            TriggerUtil.StatusPromote(Session, false, _param.Type, Convert.ToString(_param.BPolicy.OID), Convert.ToInt32(_param.OID), Convert.ToInt32(_param.OID), CommonConstant.ACTION_PROMOTE, null);
            //
            //     for (var i = 0; i < issue.getManagers().size(); i++) {
            //         // 담당인원 설정
            //         OpenIssueRelationship relManager = OpenIssueRelationship.builder()
            //             .type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER)
            //             .fromOID(resultOid)
            //             .toOID(issue.getManagers().get(i))
            //             .createUs(reqUserUid)
            //             .build();
            //
            //         openIssueDAO.insertDopenissueRelationship(relManager);
            //     }
            // }
        }
        return openIssues;

    }

    @Transactional
    public OpenIssue insertIssue(OpenIssue issue, int reqUserUid) throws Exception {
        if (reqUserUid < 1) {
            throw new CRequiredException();
        }
        Person reqUserData = personDAO.selPersonById(reqUserUid);
        if (reqUserData == null) {
            throw new CRequiredException();
        }

        issue.setFromOID(issue.getProjectOID());
        issue.setRootOID(issue.getProjectOID());
        issue.setType(PmsConstant.TYPE_ISSUE_PROJECT);
        issue.setIssueState(78104);

        //pm
        PmsRelationship pmRel = pmsDAO.selPmsRelationship(PmsRelationship.builder()
                .type(PmsConstant.RELATIONSHIP_MEMBER)
                .roleOID(PmsConstant.OPEN_ISSUE_ROLE_MANAGER)
                .rootOID(issue.getRootOID())
                .build()).stream().findFirst().orElse(null);

        if (pmRel != null) {
            issue.setManagerOID(pmRel.getToOID());
        }

        if (issue.getType() == null) {
            throw new CRequiredException("필수값 없음");
        }
        DObject dobj = DObject.builder()
                .type(issue.getType())
                .tableNm(PmsConstant.TABLE_ISSUE)
                .name("오픈 이슈")
                .description(issue.getDescription())
                .bpolicyOID(121)
                .createUs(reqUserUid)
                .build();
        commonDAO.insDObject(dobj);
        Integer resultOid = dobj.getOid();
        if (resultOid == null) throw new RuntimeException("등록 실패");

        issue.setOid(resultOid);
        openIssueDAO.insOpenIssue(issue);

        if(issue.getOpenIssueGroup() != null && issue.getOpenIssueGroup() > 0
            && issue.getOpenIssueCategoryOid() != null && issue.getOpenIssueCategoryOid() > 0) {

            OpenIssueRelationship OpenIssueCategory = new OpenIssueRelationship();
            OpenIssueCategory.setFromOID(issue.getOpenIssueCategoryOid());
            List<OpenIssueRelationship> openIssueRelationshipList = findOpenIssueRelationshipList(OpenIssueCategory);

            OpenIssueGroupDef openIssueGroupDefParam = new OpenIssueGroupDef();
            openIssueGroupDefParam.setOid(issue.getOpenIssueCategoryOid());
            openIssueGroupDefParam.setType(CommonConstant.TYPE_OPENISSUEGROUP);
            OpenIssueGroupDef openIssueGroupDefData = openIssueDAO.selectOpenIssueGroupDefByData(openIssueGroupDefParam);

            if(openIssueRelationshipList != null && !openIssueRelationshipList.isEmpty()) {
                String createdAt = issue.getCreateDt() != null ?
                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(
                                LocalDateTime.ofInstant(issue.getCreateDt().toInstant(), java.time.ZoneId.systemDefault())
                        ) : DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now());

                String safe = issue.getDescription() == null ? "" : issue.getDescription()
                        .replace("&", "&amp;")
                        .replace("<", "&lt;")
                        .replace(">", "&gt;")
                        .replace("\n", "<br/>");

                String managerName = "";
                if (issue.getOpenIssueManager() != null && !issue.getOpenIssueManager().isEmpty() && issue.getOpenIssueManager().get(0) != null) {
                    managerName = Optional.ofNullable(issue.getOpenIssueManager().get(0).getPersonNm()).orElse("");
                }

                String htmlBody = "<html><body>" +
                        "<h3 style='margin:0 0 8px 0;'>오픈이슈 신규 등록</h3>" +
                        "<table style='border-collapse:collapse;width:100%;max-width:800px;font-family:Arial,Helvetica,sans-serif;font-size:13px;'>" +
                        "<colgroup><col style='width:160px'><col></colgroup>" +
                        row("이슈명", openIssueGroupDefData.getName()) +
                        row("등록일", createdAt) +
                        row("이슈번호", String.valueOf(issue.getIssueNo())) +
                        row("이슈", issue.getContents()) +
                        row("내용", "<div style='white-space:normal;line-height:1.5'>" + safe + "</div>") +
                        row("담당자", managerName) +
                        row("START DATE", formatDate(issue.getStrDt())) +
                        row("END DATE", formatDate(issue.getFinDt())) +
                        row("작성자", reqUserData.getName()) +
                        "</table>" +
                        "<div style='margin-top:12px'><a href='http://125.141.105.16:12032/dashboard' target='_blank' style='color:#1a73e8;text-decoration:none;'>PLM 바로가기</a></div>" +
                        "</body></html>";

                for(OpenIssueRelationship openIssueRelationship : openIssueRelationshipList) {
                    if(openIssueRelationship == null) continue;
                    //메일 전송
                    if(openIssueRelationship.getEmail() != null && !openIssueRelationship.getEmail().isEmpty())
                    {
                        MailRequest mailRequest = new MailRequest();
                        mailRequest.setTo(openIssueRelationship.getEmail());
                        mailRequest.setName(openIssueRelationship.getPersonNm());
                        mailRequest.setSubject("오픈이슈 신규 등록_" + issue.getContents());
                        mailRequest.setBody(htmlBody);
                        mailService.send(mailRequest);
                    }
                }
            }
        }

        List<OpenIssueRelationship> relManagers = new ArrayList<>();
        if (issue.getOpenIssueManager() != null && !issue.getOpenIssueManager().isEmpty()) {
            for (OpenIssueRelationship iManager : issue.getOpenIssueManager()) {
                relManagers.add(OpenIssueRelationship.builder()
                        .type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER)
                        .fromOID(issue.getOid())
                        .toOID(iManager.getToOID())
                        .createUs(reqUserUid)
                        .build());
            }
        }

        if (issue.getManagers() != null && !issue.getManagers().isEmpty()) {
            for (var i = 0; i < issue.getManagers().size(); i++) {
                // 담당인원 설정
                relManagers.add(OpenIssueRelationship.builder()
                        .type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER)
                        .fromOID(resultOid)
                        .toOID(issue.getManagers().get(i))
                        .createUs(reqUserUid)
                        .build());
            }
        }
        if (!relManagers.isEmpty()) {
            openIssueDAO.insertDopenissueRelationshipBatch(relManagers);
        }

// 파일 관련 로직
//        if (_param.Files != null)
//        {
//            HttpFileRepository.InsertData(Session, _param);
//        }
//
//        if (_param.delFiles != null)
//        {
//            _param.delFiles.ForEach(v =>
//                    {
//                            HttpFileRepository.DeleteData(Session, v);
//                    });
//        }

// Task 관련 로직
//        Integer taskOID = null;
//        if (!Objects.equals(issue.getRootOID(), issue.getFromOID()))
//        {
//            taskOID = issue.getFromOID();
//        }
//        PmsRelationship relDobj = PmsRelationship.builder()
//                .type(PmsConstant.RELATIONSHIP_ISSUE)
//                .fromOID(issue.getFromOID())
//                .toOID(resultOid)
//                .rootOID(issue.getRootOID())
//                .taskOID(taskOID)
//                .createUs(reqUserUid)
//                .build();
//        pmsDAO.insPmsRelationship(relDobj);
//
//        if (issue.ecoOID != null)
//        {
//            Integer ecoTaskOID = null;
//            if (!Objects.equals(issue.getRootOID(), issue.getFromOID()))
//            {
//                ecoTaskOID = issue.getFromOID();
//            }
//
//            PmsRelationship ecoRelObj = PmsRelationship.builder()
//                    .type(PmsConstant.RELATIONSHIP_ISSUE_ECO)
//                    .fromOID(issue.getFromOID())
//                    .toOID(resultOid)
//                    .rootOID(issue.getRootOID())
//                    .taskOID(ecoTaskOID)
//                    .createUs(reqUserUid)
//                    .build();
//            pmsDAO.insPmsRelationship(ecoRelObj);
//        }

        return issue;
    }

    @Transactional
    public List<OpenIssue> updateIssue(List<OpenIssue> issues, int reqUserUid) throws Exception {
        LocalDateTime now = LocalDateTime.now();
        String nowStr = now.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        for (OpenIssue i : issues) {
            if (i.getOid() == null) throw new CModifictionFailException("해당 이슈를 찾을 수 없습니다");
            if (i.getOid() < 1) {
                // insert
                insertIssue(i, reqUserUid);
                continue;
            }

            try {
                OpenIssue openIssueParam = new OpenIssue();
                openIssueParam.setOid(i.getOid());
                OpenIssue data = openIssueDAO.selOpenIssue(openIssueParam);
                if(data == null) {
                    throw new CModifictionFailException("이슈 업데이트 실패");
                }

                if(!Objects.equals(i.getIssueState(), data.getIssueState()))
                {
                    DLibrary libraryParam = new DLibrary();
                    libraryParam.setOid(data.getIssueState());
                    DLibrary libraryData = dLibraryService.selSingleLibrary(libraryParam);
                    if(Objects.equals(libraryData.korNm, CommonConstant.ISSUE_STATE_LIBRARY_CLOSE))
                    {
                        i.setReStartDt(nowStr);
                    }

                    DLibrary libraryParam2 = new DLibrary();
                    libraryParam2.setOid(i.getIssueState());
                    DLibrary libraryData2 = dLibraryService.selSingleLibrary(libraryParam2);
                    if(Objects.equals(libraryData2.korNm, CommonConstant.ISSUE_STATE_LIBRARY_CLOSE))
                    {
                        i.setCloseDt(nowStr);
                    }

                    OpenIssueGroupDef openIssueGroupDefParam = new OpenIssueGroupDef();
                    openIssueGroupDefParam.setOid(i.getOpenIssueCategoryOid());
                    openIssueGroupDefParam.setType(CommonConstant.TYPE_OPENISSUEGROUP);
                    OpenIssueGroupDef openIssueGroupDefData = openIssueDAO.selectOpenIssueGroupDefByData(openIssueGroupDefParam);

                    if(i.getOpenIssueGroup() != null && i.getOpenIssueGroup() > 0
                            && i.getOpenIssueCategoryOid() != null && i.getOpenIssueCategoryOid() > 0) {

                        OpenIssueRelationship OpenIssueCategory = new OpenIssueRelationship();
                        OpenIssueCategory.setFromOID(i.getOid());
                        List<OpenIssueRelationship> openIssueRelationshipList = findOpenIssueRelationshipList(OpenIssueCategory);

                        Person reqUserData = personDAO.selPersonById(i.getCreateUs());

                        OpenIssueRelationship reqUserDataRelationship = new OpenIssueRelationship();
                        reqUserDataRelationship.setToOID(reqUserData.getOid());
                        reqUserDataRelationship.setEmail(reqUserData.getEmail());
                        reqUserDataRelationship.setPersonNm(reqUserData.getName());

                        if (openIssueRelationshipList == null) {
                            openIssueRelationshipList = new ArrayList<>();
                        }

                        Integer authorToOID = reqUserDataRelationship.getToOID();
                        boolean existsSameToOID = false;
                        if (authorToOID != null) {
                            for (OpenIssueRelationship rel : openIssueRelationshipList) {
                                if (rel == null) continue;
                                Integer toOID = rel.getToOID();
                                if (toOID != null && toOID.equals(authorToOID)) {
                                    existsSameToOID = true;
                                    break;
                                }
                            }
                        }
                        if (!existsSameToOID) {
                            // 요청: 맨 앞이 아닌 마지막 행에 추가하도록 변경
                            openIssueRelationshipList.add(reqUserDataRelationship);
                        }

                        if(openIssueRelationshipList != null && !openIssueRelationshipList.isEmpty()) {
                            String createdAt = i.getCreateDt() != null ?
                                    DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(
                                            LocalDateTime.ofInstant(i.getCreateDt().toInstant(), java.time.ZoneId.systemDefault())
                                    ) : DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now());

                            String safe = i.getDescription() == null ? "" : i.getDescription()
                                    .replace("&", "&amp;")
                                    .replace("<", "&lt;")
                                    .replace(">", "&gt;")
                                    .replace("\n", "<br/>");

                            String managerName = "";
                            if (i.getOpenIssueManager() != null && !i.getOpenIssueManager().isEmpty() && i.getOpenIssueManager().get(0) != null) {
                                managerName = Optional.ofNullable(i.getOpenIssueManager().get(0).getPersonNm()).orElse("");
                            }

                            String htmlBody = "<html><body>" +
                                    "<h3 style='margin:0 0 8px 0;'>오픈이슈 상태 변경</h3>" +
                                    "<table style='border-collapse:collapse;width:100%;max-width:800px;font-family:Arial,Helvetica,sans-serif;font-size:13px;'>" +
                                    "<colgroup><col style='width:160px'><col></colgroup>" +
                                    row("이슈명", openIssueGroupDefData.getName()) +
                                    row("등록일", createdAt) +
                                    row("이슈번호", String.valueOf(data.getIssueNo())) +
                                    row("이슈", i.getContents()) +
                                    row("내용", "<div style='white-space:normal;line-height:1.5'>" + safe + "</div>") +
                                    row("상태", libraryData2.getKorNm()) +
                                    row("담당자", managerName) +
                                    row("START DATE", formatDate(i.getStrDt())) +
                                    row("END DATE", formatDate(i.getFinDt())) +
                                    row("작성자", i.getCreateUsNm()) +
                                    "</table>" +
                                    "<div style='margin-top:12px'><a href='http://125.141.105.16:12032/dashboard' target='_blank' style='color:#1a73e8;text-decoration:none;'>PLM 바로가기</a></div>" +
                                    "</body></html>";

                            for(OpenIssueRelationship openIssueRelationship : openIssueRelationshipList) {
                                if(openIssueRelationship == null) continue;
                                //메일 전송
                                if(openIssueRelationship.getEmail() != null && !openIssueRelationship.getEmail().isEmpty())
                                {
                                    MailRequest mailRequest = new MailRequest();
                                    mailRequest.setTo(openIssueRelationship.getEmail());
//                                mailRequest.setName(openIssueRelationship.getPersonNm());
                                    mailRequest.setSubject("오픈이슈 상태 변경_" + i.getContents());
                                    mailRequest.setBody(htmlBody);
                                    mailService.send(mailRequest);
                                }
                            }
                        }
                    }
                }

                openIssueDAO.updateOpenIssue(i);
                commonDAO.udtDObject(DObject.builder()
                        .oid(i.getOid())
                        .description(i.getDescription())
                        .build());

            } catch (Exception e) {
                throw new CModifictionFailException("이슈 업데이트 실패");
            }

            try {
                openIssueDAO.deleteRelationsByFromAndType(OpenIssueRelationship.builder()
                        .type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER)
                        .fromOID(i.getOid())
                        .build());
            } catch (Exception e) {
                e.printStackTrace();
                throw new CModifictionFailException("relation 삭제 실패");
            }
            List<OpenIssueRelationship> relManagers = new ArrayList<>();
            if (i.getOpenIssueManager() != null && !i.getOpenIssueManager().isEmpty()) {
                for (OpenIssueRelationship iManager : i.getOpenIssueManager()) {
                    relManagers.add(OpenIssueRelationship.builder()
                            .type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER)
                            .fromOID(i.getOid())
                            .toOID(iManager.getToOID())
                            .createUs(reqUserUid)
                            .build());
                }
            } else if (i.getIssueManagers() != null && !i.getIssueManagers().isEmpty()) {
                for (Integer iManager : i.getIssueManagers()) {
                    relManagers.add(OpenIssueRelationship.builder()
                            .type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER)
                            .fromOID(i.getOid())
                            .toOID(iManager)
                            .createUs(reqUserUid)
                            .build());
                }
            }
            if (!relManagers.isEmpty()) {
                openIssueDAO.insertDopenissueRelationshipBatch(relManagers);
            }
        }
        return issues;
    }

    @Transactional
    public Integer deleteIssue(Integer oid, Integer userUid) throws Exception {
        Integer result2 = openIssueDAO.deleteRelationsByFromAndType(OpenIssueRelationship.builder()
                .type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER)
                .fromOID(oid)
                .build());

        Integer result1 = openIssueDAO.deleteOpenIssue(oid);
        if (result1 < 1) throw new CNotFoundException("삭제 대상을 찾을 수 없습니다");

        DObject objParam = new DObject();
        objParam.setOid(oid);
        objParam.setDeleteUs(userUid);
        Integer objResult = commonDAO.delDObject(objParam);
        if (objResult < 1) throw new CNotFoundException("삭제 대상을 찾을 수 없습니다");

        return oid;
    }

    @Transactional
    public List<OpenIssue> deleteIssueBatch(List<OpenIssue> issues, Integer userUid) throws Exception {

        List<Integer> targetOIDs = issues.stream().map(OpenIssue::getOid).toList();
        if (targetOIDs.isEmpty()) throw new CNotFoundException("삭제 대상을 찾을 수 없습니다");

        openIssueDAO.deleteOpenIssueRelationship(OpenIssueRelationship.builder()
                .type(PmsConstant.RELATIONSHIP_ISSUE_MANAGER)
                .fromOIDs(targetOIDs)
                .build());


        Integer result1 = openIssueDAO.deleteOpenIssueBatch(targetOIDs);
        if (result1 < 1) throw new CNotFoundException("삭제 대상을 찾을 수 없습니다");

        DObject objParam = new DObject();
        objParam.setOids(targetOIDs);
        objParam.setDeleteUs(userUid);
        Integer objResult = commonDAO.delDObjectBatch(objParam);
        if (objResult < 1) throw new CNotFoundException("삭제 대상을 찾을 수 없습니다");

        return issues;
    }


    //    @Transactional
    public List<OpenIssueGroupDef> findOpenIssueGroupDefList(OpenIssueGroupDef cond, int reqUserUid) throws Exception {

        List<OpenIssueGroupDef> result = new ArrayList<>();
        List<OpenIssueGroupDef> dataList = openIssueDAO.selectOpenIssueGroupDefList(cond);
        Person reqUserData = personDAO.selPersonById(reqUserUid);

        BPolicyAuth bPolicyAuthParam = new BPolicyAuth();
        bPolicyAuthParam.setType(CommonConstant.TYPE_OPENISSUEGROUP);
        List<BPolicyAuth> lBPolicyAuth = bPolicyAuthService.selBPolicyAuths(bPolicyAuthParam);

        OpenIssueRelationship memberRelParam = new OpenIssueRelationship();
        // dataList 의 OID 들을 FromOIDs 로 설정하여 한번에 멤버 관계를 조회
        List<Integer> groupOids = new ArrayList<>();
        for (OpenIssueGroupDef d : dataList) {
            if (d.getOid() != null) groupOids.add(d.getOid());
        }
        memberRelParam.setFromOIDs(groupOids);
        memberRelParam.setType(PmsConstant.RELATIONSHIP_MEMBER);
        List<OpenIssueRelationship> lMemberData = openIssueDAO.selectRelationshipByCondition(memberRelParam);

        for (OpenIssueGroupDef data : dataList) {
            List<BPolicyAuth> bpolicyAuthList = bPolicyAuthService.mainAuth(reqUserUid, data, pmsAuthService.roleAuthOpenIssueGroup(data, lMemberData, lBPolicyAuth, reqUserUid), lBPolicyAuth);
            data.setBpolicyAuths(bpolicyAuthList);
            if (Objects.equals(reqUserData.getId(), CommonConstant.ID_ADMIN)) {
                result.add(data);
            } else if (reqUserData.getHiddenGuest() != null && reqUserData.getHiddenGuest() > 0) {
                result.add(data);
            } else if (data.getBpolicyAuths() != null
                    && data.getBpolicyAuths().stream().anyMatch(item -> CommonConstant.AUTH_VIEW.equals(item.getAuthNm()))) {
                result.add(data);
            }
        }

        return result;
    }

    @Transactional
    public OpenIssueGroupDef findOpenIssueGroupDefById(Integer oid, int reqUserUid) throws Exception {
        OpenIssueGroupDef result = openIssueDAO.selectOpenIssueGroupDefById(oid);

        if (result != null) {
            result.setBpolicy(commonDAO.selBPolicy(BPolicy.builder().oid(result.getBpolicyOID()).build()));
            result.setBpolicyNm(result.getBpolicy().getName());
            result.setBpolicyAuths(bPolicyAuthService.mainAuth(reqUserUid, result, pmsAuthService.roleAuthOpenIssueGroup(reqUserUid, result)));
//            = BPolicyAuthRepository.MainAuth(Context, pmsProject, PmsAuth.RoleAuth(Context, pmsProject));


            OpenIssueRelationship memberRelParam = new OpenIssueRelationship();
            memberRelParam.setFromOID(result.getOid());
            memberRelParam.setType(PmsConstant.RELATIONSHIP_MEMBER);
            List<OpenIssueRelationship> lMemberData = openIssueDAO.selectRelationshipByCondition(memberRelParam);
            List<OpenIssueRelationship> getMemberList = new ArrayList<>();

            Person tmpPerson = new Person();
            for (OpenIssueRelationship memberData : lMemberData) {
                tmpPerson = personService.selPersonByOid(Objects.requireNonNull(memberData.getToOID()));

                if (tmpPerson.getHiddenGuest() != null && tmpPerson.getHiddenGuest().equals(CommonConstant.PERSON_ACTION_HIDDEN_GUEST)) {

                } else {

                }

                memberData.setPersonNm(tmpPerson.getName());
                memberData.setDepartmentNm(tmpPerson.getDepartmentNm());
                memberData.setJobTitleOrd(tmpPerson.getJobTitleOrd());
                memberData.setJobTitleNm(tmpPerson.getJobTitleNm());
                memberData.setEmail(tmpPerson.getEmail());
                memberData.setThumbnail(tmpPerson.getThumbnail());
                getMemberList.add(memberData);
            }


            result.setOpenIssueRelationship(getMemberList);
        }
        if (result == null) throw new CNotFoundException("해당 그룹을 찾을 수 없습니다.");
        return result;
    }


    @Transactional
    public List<OpenIssueRelationship> findOpenIssueGroupDefaultMemberList(String groupType, int reqUserUid) throws Exception {
        if (reqUserUid < 1) {
            throw new CRequiredException();
        }
        Person reqUserData = personDAO.selPersonById(reqUserUid);
        if (reqUserData == null) {
            throw new CRequiredException();
        }
        List<OpenIssueRelationship> result = new ArrayList<>();

        OpenIssueGroupDef oiParentGroupParam = new OpenIssueGroupDef();
        oiParentGroupParam.setGroupDepartmentOid(reqUserData.getDepartmentOID());
        oiParentGroupParam.setType(CommonConstant.TYPE_OPENISSUEGROUP);
        oiParentGroupParam.setGroupType(groupType);

        List<OpenIssueGroupDef> oiParentGroupList = openIssueDAO.selectOpenIssueGroupDefList(oiParentGroupParam);
        OpenIssueGroupDef oiParentGroup = oiParentGroupList.stream().filter(f -> f.getFromOid() == null).findFirst().orElse(null);//openIssueDAO.selectOpenIssueGroupDefByData(oiParentGroupParam);

        if (oiParentGroup != null) {
            result = openIssueDAO.selectRelationshipByCondition(OpenIssueRelationship.builder()
                    .fromOID(oiParentGroup.getOid())
                    .type(PmsConstant.RELATIONSHIP_MEMBER)
                    .build());

            // Batch-enrich person and department names without N+1 lookups
            Set<Integer> toIds = new HashSet<>();
            for (OpenIssueRelationship rel : result) {
                if (rel.getToOID() != null) toIds.add(rel.getToOID());
            }
            Map<Integer, Person> personMap = new HashMap<>();
            if (!toIds.isEmpty()) {
                Person personParam = new Person();
                personParam.setType(CommonConstant.TYPE_PERSON);
                personParam.setOids(new ArrayList<>(toIds));
                List<Person> persons = personService.selPersons(personParam);
                if (persons != null) {
                    for (Person p : persons) {
                        if (p.getOid() != null) personMap.put(p.getOid(), p);
                    }
                }
            }
            for (OpenIssueRelationship data : result) {
                Person p = (data.getToOID() != null) ? personMap.get(data.getToOID()) : null;
                data.setPersonNm(p != null && p.getName() != null ? p.getName() : "");
                data.setDepartmentNm(p != null && p.getDepartmentNm() != null ? p.getDepartmentNm() : "");
            }

        } else {
            Person personParam = new Person();
            personParam.setDepartmentOID(reqUserData.getDepartmentOID());
            personParam.setType(CommonConstant.TYPE_PERSON);
            List<Person> rootMemberList = personService.selPersons(personParam);

            for (Person rootMember : rootMemberList) {
                if(rootMember.getOid() != null) {
                    OpenIssueRelationship groupRootRelParam = new OpenIssueRelationship();
                    groupRootRelParam.setToOID(rootMember.getOid());
                    groupRootRelParam.setDepartmentNm(rootMember.getDepartmentNm());
                    groupRootRelParam.setPersonNm(rootMember.getName());
                    groupRootRelParam.setType(PmsConstant.RELATIONSHIP_MEMBER);
                    if(reqUserUid == rootMember.getOid()) {
                        groupRootRelParam.setRoleOid(PmsConstant.OPEN_ISSUE_ROLE_ADMIN); // 관리자
                    }else{
                        groupRootRelParam.setRoleOid(PmsConstant.OPEN_ISSUE_ROLE_MANAGER); // 담당자
                    }
                    result.add(groupRootRelParam);
                }
            }
        }

        return result;
    }

    @Transactional
    public OpenIssueGroupDef createOpenIssueGroupDef(OpenIssueGroupDef data, int reqUserUid) throws Exception {
        if (reqUserUid < 1) {
            throw new CRequiredException();
        }
        Person reqUserData = personDAO.selPersonById(reqUserUid);
        if (reqUserData == null) {
            throw new CRequiredException();
        }

        OpenIssueGroupDef oiParentGroupParam = new OpenIssueGroupDef();
        oiParentGroupParam.setGroupDepartmentOid(reqUserData.getDepartmentOID());
        oiParentGroupParam.setType(CommonConstant.TYPE_OPENISSUEGROUP);
        oiParentGroupParam.setGroupType(data.getGroupType());

        List<OpenIssueGroupDef> oiParentGroupList = openIssueDAO.selectOpenIssueGroupDefList(oiParentGroupParam);
        OpenIssueGroupDef oiParentGroup = oiParentGroupList.stream().filter(f -> f.getFromOid() == null).findFirst().orElse(null);//openIssueDAO.selectOpenIssueGroupDefByData(oiParentGroupParam);

        if (oiParentGroup != null) {
            data.setFromOid(oiParentGroup.getOid());
        } else {
            DObject oiParentGroupParamObj = new DObject();
            oiParentGroupParamObj.setName(reqUserData.getDepartmentNm());
            oiParentGroupParamObj.setType(CommonConstant.TYPE_OPENISSUEGROUP);
            oiParentGroupParamObj.setTableNm(CommonConstant.TABLE_OPENISSUEGROUP);
            oiParentGroupParamObj.setCreateUs(reqUserUid);

            Integer resultParentOid = dObjectService.insDObject(oiParentGroupParamObj);

            oiParentGroupParam.setOid(resultParentOid);
            oiParentGroupParam.setOrd(999);
            openIssueDAO.insertOpenIssueGroupDef(oiParentGroupParam);

            data.setFromOid(resultParentOid);

            List<Person> rootMemberList = personDAO.selPerson(
                    Person.builder().type(CommonConstant.TYPE_PERSON).
                            departmentOID(reqUserData.getDepartmentOID()).build()
            );

            for (Person rootMember : rootMemberList) {
                OpenIssueRelationship groupRootRelParam = new OpenIssueRelationship();
                if(rootMember.getOid() != null) {
                    groupRootRelParam.setRootOid(resultParentOid);
                    groupRootRelParam.setFromOID(resultParentOid);
                    groupRootRelParam.setToOID(rootMember.getOid());
                    groupRootRelParam.setType(PmsConstant.RELATIONSHIP_MEMBER);
                    groupRootRelParam.setCreateUs(reqUserUid);
                    if(reqUserUid == rootMember.getOid()) {
                        groupRootRelParam.setRoleOid(PmsConstant.OPEN_ISSUE_ROLE_ADMIN); // 관리자
                    }else{
                        groupRootRelParam.setRoleOid(PmsConstant.OPEN_ISSUE_ROLE_MANAGER); // 담당자
                    }
                    openIssueDAO.insertDopenissueRelationship(groupRootRelParam);
                }
            }
        }

        data.setName(data.getName());
        data.setType(CommonConstant.TYPE_OPENISSUEGROUP);
        data.setTableNm(CommonConstant.TABLE_OPENISSUEGROUP);
        data.setCreateUs(reqUserUid);
        data.setGroupType(data.getGroupType());
        data.setGroupDepartmentOid(reqUserData.getDepartmentOID());
        Integer resultOid = dObjectService.insDObject(data);

        data.setOid(resultOid);
        data.setOrd(999);
        int inserted = openIssueDAO.insertOpenIssueGroupDef(data);

        for(OpenIssueRelationship relData : data.getOpenIssueRelationship()) {
            OpenIssueRelationship groupRelParam = new OpenIssueRelationship();
            groupRelParam.setRootOid(data.getFromOid());
            groupRelParam.setFromOID(data.getOid());
            groupRelParam.setToOID(relData.getToOID());
            groupRelParam.setType(PmsConstant.RELATIONSHIP_MEMBER);
            groupRelParam.setCreateUs(reqUserUid);
            groupRelParam.setRoleOid(relData.getRoleOid());
            openIssueDAO.insertDopenissueRelationship(groupRelParam);
        }

        for(OpenIssueGroupCategory category : data.getGroupCategory())
        {
            OpenIssueGroupCategory categoryParam = new OpenIssueGroupCategory();
            categoryParam.setOpenIssueGroupCategoryOid(data.getOid());
            categoryParam.setValue(category.getValue());
            categoryParam.setCreateUs(reqUserUid);
            openIssueDAO.insertOpenIssueGroupCategory(categoryParam);
        }

//        OpenIssueRelationship groupRootRelParam = new OpenIssueRelationship();
//        groupRootRelParam.setRootOid(data.getFromOid());
//        groupRootRelParam.setFromOID(data.getFromOid());
//        groupRootRelParam.setType(PmsConstant.RELATIONSHIP_MEMBER);
//        groupRootRelParam.setCreateUs(reqUserUid);

//        List<OpenIssueRelationship> relRootDataList = openIssueDAO.selectRelationshipByCondition(groupRootRelParam);
//        for (OpenIssueRelationship relData : relRootDataList) {
//            OpenIssueRelationship groupRelParam = new OpenIssueRelationship();
//            groupRelParam.setRootOid(relData.getFromOID());
//            groupRelParam.setFromOID(data.getOid());
//            groupRelParam.setToOID(relData.getToOID());
//            groupRelParam.setType(PmsConstant.RELATIONSHIP_MEMBER);
//            groupRelParam.setCreateUs(reqUserUid);
//            groupRelParam.setRoleOid(relData.getRoleOid());
//            openIssueDAO.insertDopenissueRelationship(groupRelParam);
//        }

        if (inserted == 0) {
            return null;
        } else {
            return data;
        }
    }

    @Transactional
    public int modifyOpenIssueGroupDef(OpenIssueGroupDef cond, int reqUserUid) {
        try {
            if ((cond == null)) {
                throw new CRequiredException();
            }

            int result = commonDAO.udtDObject(cond);
            if(cond.getOrd() != null && cond.getOrd() > 0) {
                openIssueDAO.updateOpenIssueGroupDef(cond);
            }

            if (cond.getOpenIssueRelationship() != null) {
                cond.getOpenIssueRelationship().forEach(rel -> {
                    if (Objects.equals(rel.getAction(), "D")) {
                        openIssueDAO.deleteOpenIssueRelationship(rel);
                    } else if (Objects.equals(rel.getAction(), "U")) {
                        openIssueDAO.updateOpenIssueRelationship(rel);
                    } else if (Objects.equals(rel.getAction(), "A")) {
                        if (cond.getFromOid() != null) {
                            rel.setRootOid(cond.getFromOid());
                        } else {
                            rel.setRootOid(cond.getOid());
                        }
                        rel.setFromOID(cond.getOid());
                        rel.setToOID(rel.getToOID());
                        rel.setType(PmsConstant.RELATIONSHIP_MEMBER);
                        rel.setCreateUs(reqUserUid);
                        openIssueDAO.insertDopenissueRelationship(rel);
                    }
                });
            }

            if(cond.getGroupCategory() != null && !cond.getGroupCategory().isEmpty())
            {
                saveOpenIssueCategory(cond.getGroupCategory(), reqUserUid);
            }


            return result;
        } catch (CInvalidArgumentException e) {
            throw new CInvalidArgumentException();
        } catch (Exception e) {
            log.error("{} modifyOpenIssueGroupDef {}", this.getClass().getSimpleName(), e.getMessage());
            throw new CRequiredException();
        }
    }

    @Transactional
    public int removeOpenIssueGroupDef(OpenIssueGroupDef cond, int reqUserUid) {
        try {
            if ((cond == null)) {
                throw new CRequiredException();
            }

            int result = commonDAO.delDObject(cond);
            OpenIssueRelationship relParam = new OpenIssueRelationship();
            relParam.setFromOID(cond.getOid());
            List<OpenIssueRelationship> relData = openIssueDAO.selectRelationshipByCondition(relParam);

            if (relData != null && !relData.isEmpty()) {
//                relData = relData.stream().filter(item -> !Objects.equals(item.getType(), PmsConstant.RELATIONSHIP_MEMBER)).toList();
//                List<Integer> toOids = relData.stream()
//                        .map(OpenIssueRelationship::getToOID)
//                        .filter(Objects::nonNull)
//                        .toList();
                OpenIssue param =  new OpenIssue();
                param.setOpenIssueCategoryOid(cond.getOid());
                List<OpenIssue> openIssueList = openIssueDAO.selAllOpenIssue(param);
                List<Integer> toOids = openIssueList.stream().map(OpenIssue::getOid).filter(Objects::nonNull).toList();
                if (!toOids.isEmpty()) {
                    DObject delParam = new DObject();
                    delParam.setOids(toOids);
                    delParam.setDeleteUs(reqUserUid);
                    commonDAO.delDObjectBatch(delParam);
                }
            }

            return result;
        } catch (CInvalidArgumentException e) {
            throw new CInvalidArgumentException();
        } catch (Exception e) {
            log.error("{} removeOpenIssueGroupDef {}", this.getClass().getSimpleName(), e.getMessage());
            throw new CRequiredException();
        }
    }


    @Transactional
    public int modifyOpenIssueGroupDefStatus(OpenIssueGroupDef cond) {
        try {
            if ((cond == null)) {
                throw new CRequiredException();
            }
//            int result = openIssueDAO.updateOpenIssueGroupDef(cond);
            int result = 0;
            DObject data = commonDAO.selDObject(new DObject(cond.getOid(), CommonConstant.TYPE_OPENISSUEGROUP));
            List<BPolicy> dataPolicy = commonDAO.selBPolicys(BPolicy.builder().type(data.getType()).build());

            Integer updatePolicyOID = null;
            if (cond.getGroupStatus() != null && cond.getGroupStatus().equalsIgnoreCase(PmsConstant.POLICY_PROCESS_COMPLETED)) {
                // Find the policy where name equals PmsConstant.POLICY_PROCESS_COMPLETED and update the object's policy
                updatePolicyOID = dataPolicy.stream()
                        .filter(p -> PmsConstant.POLICY_PROCESS_COMPLETED.equals(p.getName()))
                        .map(BPolicy::getOid)
                        .filter(Objects::nonNull)
                        .findFirst()
                        .orElse(null);
            } else {
                // Find the policy where name equals PmsConstant.POLICY_PROCESS_COMPLETED and update the object's policy
                updatePolicyOID = dataPolicy.stream()
                        .filter(p -> PmsConstant.POLICY_PROCESS_PREPARE.equals(p.getName()))
                        .map(BPolicy::getOid)
                        .filter(Objects::nonNull)
                        .findFirst()
                        .orElse(null);
            }


            if (updatePolicyOID != null) {
                result = commonDAO.udtDObject(DObject.builder()
                        .oid(data.getOid())
                        .bpolicyOID(updatePolicyOID)
                        .build());
            } else {
                log.warn("{} modifyOpenIssueGroupDefStatus - Completed policy not found for type: {}", this.getClass().getSimpleName(), data.getType());
            }
//            DObjectRepository.UdtDObject(Session, new DObject { OID = Convert.ToInt32(OID), BPolicyOID = processPolicy.Find(f => f.Name == PmsConstant.POLICY_PROCESS_COMPLETED).OID });

            return result;
        } catch (CInvalidArgumentException e) {
            throw new CInvalidArgumentException();
        } catch (Exception e) {
            log.error("{} modifyOpenIssueGroupDefStatus {}", this.getClass().getSimpleName(), e.getMessage());
            throw new CRequiredException();
        }
    }

    @Transactional
    public List<OpenIssueRelationship> findOpenIssueRelationshipList(OpenIssueRelationship cond) throws Exception {
        List<Person> userList = personDAO.selPerson(new Person());
        List<OpenIssueRelationship> result = openIssueDAO.selectRelationshipByCondition(cond);

        for (OpenIssueRelationship memberData : result) {
            // Find the person in userList whose oid matches memberData.toOID
            Person tmpPerson = userList.stream()
                    .filter(u -> u != null && Objects.equals(u.getOid(), memberData.getToOID()))
                    .findFirst()
                    .orElse(null);

            if (tmpPerson != null) {
                memberData.setPersonNm(tmpPerson.getName());
                memberData.setDepartmentNm(tmpPerson.getDepartmentNm());
                memberData.setJobTitleOrd(tmpPerson.getJobTitleOrd());
                memberData.setJobTitleNm(tmpPerson.getJobTitleNm());
                memberData.setEmail(tmpPerson.getEmail());
                memberData.setThumbnail(tmpPerson.getThumbnail());
            }
        }

        return result;
    }


    @Transactional
    public OpenIssueGroupDef selectGroupDefById(Integer openIssueGroup) throws Exception {
        OpenIssueGroupDef result = openIssueDAO.selectDopenissueGroupDef(openIssueGroup, null);
        if (result == null) throw new CNotFoundException("해당 그룹을 찾을 수 없습니다.");
        return result;
    }

    @Transactional
    public boolean updateGroupDef(Integer openIssueGroup, String groupName) throws Exception {
        Integer result = openIssueDAO.selectDopenissueGroupDefCount(openIssueGroup);
        if (result > 0) {
            openIssueDAO.updateDopenissueGroupDef(openIssueGroup, groupName);
        } else {
            openIssueDAO.insertDopenissueGroupDef(openIssueGroup, groupName);
        }
        return true;
    }



    // HTML helper for table rows in mail bodies
    private static String row(String th, String td) {
        String safeTh = th == null ? "" : th;
        String safeTd = td == null ? "" : td;
        return "<tr>" +
                "<th style='text-align:left;padding:8px;border:1px solid #ddd;background:#f7f7f7;'>" + safeTh + "</th>" +
                "<td style='padding:8px;border:1px solid #ddd;'>" + safeTd + "</td>" +
                "</tr>";
    }

    // Format java.util.Date to yyyy-MM-dd for email
    private static String formatDate(java.util.Date date) {
        if (date == null) return "";
        return DateTimeFormatter.ofPattern("yyyy-MM-dd").format(
                LocalDateTime.ofInstant(date.toInstant(), java.time.ZoneId.systemDefault())
        );
    }

    @Transactional
    public OpenIssueComment insertOpenIssueComment(OpenIssueComment data, int reqUserUid) throws Exception {
        try {
            data.setCreateUs(reqUserUid);

            int inserted = openIssueDAO.insertOpenIssueComment(data);

            OpenIssueRelationship openIssueRelationshipParam = new OpenIssueRelationship();
            openIssueRelationshipParam.setFromOID(data.getOpenIssueOid());
            List<OpenIssueRelationship> openIssueRelationshipList = findOpenIssueRelationshipList(openIssueRelationshipParam);

            OpenIssue openIssueParam = new OpenIssue();
            openIssueParam.setOid(data.getOpenIssueOid());
            OpenIssue openIssueData = openIssueDAO.selOpenIssue(openIssueParam);

            Person reqUserData = personDAO.selPersonById(reqUserUid);

            OpenIssueRelationship reqUserDataRelationship = new OpenIssueRelationship();
            reqUserDataRelationship.setToOID(reqUserData.getOid());
            reqUserDataRelationship.setEmail(reqUserData.getEmail());
            reqUserDataRelationship.setPersonNm(reqUserData.getName());

            // Include requester at the top only if no existing recipient has the same ToOID
            if (openIssueRelationshipList == null) {
                openIssueRelationshipList = new ArrayList<>();
            }

            Integer authorToOID = reqUserDataRelationship.getToOID();
            boolean existsSameToOID = false;
            if (authorToOID != null) {
                for (OpenIssueRelationship rel : openIssueRelationshipList) {
                    if (rel == null) continue;
                    Integer toOID = rel.getToOID();
                    if (toOID != null && toOID.equals(authorToOID)) {
                        existsSameToOID = true;
                        break;
                    }
                }
            }

            OpenIssueGroupDef openIssueGroupDefParam = new OpenIssueGroupDef();
            openIssueGroupDefParam.setOid(openIssueData.getOpenIssueCategoryOid());
            openIssueGroupDefParam.setType(CommonConstant.TYPE_OPENISSUEGROUP);
            OpenIssueGroupDef openIssueGroupDefData = openIssueDAO.selectOpenIssueGroupDefByData(openIssueGroupDefParam);

            String managerNm = "";
            if(openIssueRelationshipList != null && !openIssueRelationshipList.isEmpty())
            {
                managerNm = openIssueRelationshipList.get(0).getPersonNm();
            }

            if (!existsSameToOID) {
                openIssueRelationshipList.add(reqUserDataRelationship);
            }

            if(openIssueRelationshipList != null && !openIssueRelationshipList.isEmpty()) {
                String commenter = data.getCreateUsNm() != null ? data.getCreateUsNm() : String.valueOf(data.getCreateUs());
                String createdAt = data.getCreateDt() != null ?
                        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(
                                LocalDateTime.ofInstant(data.getCreateDt().toInstant(), java.time.ZoneId.systemDefault())
                        ) : DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm").format(LocalDateTime.now());

                String safe = data.getComment() == null ? "" : data.getComment()
                        .replace("&", "&amp;")
                        .replace("<", "&lt;")
                        .replace(">", "&gt;")
                        .replace("\n", "<br/>");

                String htmlBody = "<html><body>" +
                        "<h3 style='margin:0 0 8px 0;'>오픈이슈 신규 의견</h3>" +
                        "<table style='border-collapse:collapse;width:100%;max-width:800px;font-family:Arial,Helvetica,sans-serif;font-size:13px;'>" +
                        "<colgroup><col style='width:160px'><col></colgroup>" +
                        row("이슈명", openIssueGroupDefData.getName()) +
                        row("등록일", createdAt) +
                        row("이슈번호", String.valueOf(openIssueData.getIssueNo())) +
                        row("이슈", openIssueData.getContents()) +
                        row("의견", "<div style='white-space:normal;line-height:1.5'>" + safe + "</div>") +
                        row("담당자", managerNm) +
                        row("START DATE", formatDate(openIssueData.getStrDt())) +
                        row("END DATE", formatDate(openIssueData.getFinDt())) +
                        row("작성자", openIssueData.getCreateUsNm()) +
                        "</table>" +
                        "<div style='margin-top:12px'><a href='http://125.141.105.16:12032/dashboard' target='_blank' style='color:#1a73e8;text-decoration:none;'>PLM 바로가기</a></div>" +
                        "</body></html>";

                for(OpenIssueRelationship openIssueRelationship : openIssueRelationshipList) {
                    if(openIssueRelationship == null) continue;
                    //메일 전송
                    if(openIssueRelationship.getEmail() != null && !openIssueRelationship.getEmail().isEmpty()) {
                        MailRequest mailRequest = new MailRequest();
                        mailRequest.setTo(openIssueRelationship.getEmail());
                        mailRequest.setName(openIssueRelationship.getPersonNm());
                        mailRequest.setSubject("오픈이슈 신규 의견_" + openIssueData.getContents());
                        mailRequest.setBody(htmlBody);
                        mailService.send(mailRequest);
                    }
                }
            }

            if(inserted == 0) {
                throw new CBizProcessFailException("코멘트 등록 실패");
            }
            return data;
        } catch (Exception e) {
            log.error("{} insertOpenIssueComment {}", this.getClass().getSimpleName(), e.getMessage());
            throw new CBizProcessFailException("코멘트 등록 실패", e);
        }
    }

    @Transactional
    public OpenIssueComment modifyOpenIssueComment(OpenIssueComment data, int reqUserUid) throws Exception {
        try {
            data.setModifyUs(reqUserUid);

            int modify = openIssueDAO.updateOpenIssueComment(data);
            if(modify == 0) {
                throw new CBizProcessFailException("코멘트 업데이트 실패");
            }
            return data;
        } catch (Exception e) {
            log.error("{} modifyOpenIssueComment {}", this.getClass().getSimpleName(), e.getMessage());
            throw new CBizProcessFailException("코멘트 업데이트 실패", e);
        }
    }

    @Transactional(readOnly = true)
    public List<OpenIssueComment> findOpenIssueCommentList(OpenIssueComment cond) throws Exception {
        return openIssueDAO.selectOpenIssueCommentList(cond);
    }

    @Transactional(readOnly = true)
    public OpenIssueComment findOpenIssueComment(OpenIssueComment cond) throws Exception {
        return openIssueDAO.selectOpenIssueComment(cond);
    }

    @Transactional
    public Integer removeOpenIssueComment(Integer oid) throws Exception {
        OpenIssueComment param = new OpenIssueComment();
        param.setOid(oid);
        int deleted = openIssueDAO.deleteOpenIssueComment(param);
        if (deleted < 1) {
            throw new CNotFoundException("삭제 대상을 찾을 수 없습니다");
        }
        return oid;
    }


    @Transactional(readOnly = true)
    public List<OpenIssueGroupCategory> findOpenIssueCategoryList(OpenIssueGroupCategory cond) throws Exception {
        return openIssueDAO.selectOpenIssueGroupCategoryList(cond);
    }

    @Transactional
    public int saveOpenIssueCategory(List<OpenIssueGroupCategory> cond, int reqUserUid) {
        try {
            if ((cond == null)) {
                throw new CRequiredException();
            }

            if (!cond.isEmpty()) {
                cond.forEach(rel -> {
                    if (Objects.equals(rel.getAction(), "D")) {
                        openIssueDAO.deleteOpenIssueGroupCategory(rel);

                        OpenIssue openIssueParam = new OpenIssue();
                        openIssueParam.setGroupCategoryOid(rel.getOid());
                        List<OpenIssue> data = openIssueDAO.selAllOpenIssue(openIssueParam);

                        data.forEach(openIssue -> {
                            OpenIssue openIssueUpdate = new OpenIssue();
                            openIssueUpdate.setOid(openIssue.getOid());
                            openIssueUpdate.setGroupCategoryOid(null);
                            openIssueDAO.updateOpenIssueIsNull(openIssueUpdate);
                        });

                    } else if (Objects.equals(rel.getAction(), "U")) {
                        openIssueDAO.updateOpenIssueGroupCategory(rel);
                    } else if (Objects.equals(rel.getAction(), "A")) {
                        rel.setCreateUs(reqUserUid);
                        openIssueDAO.insertOpenIssueGroupCategory(rel);
                    }
                });
            }

            return 1;
        } catch (CInvalidArgumentException e) {
            throw new CInvalidArgumentException();
        } catch (Exception e) {
            log.error("{} saveOpenIssueCategory {}", this.getClass().getSimpleName(), e.getMessage());
            throw new CRequiredException();
        }
    }

}
