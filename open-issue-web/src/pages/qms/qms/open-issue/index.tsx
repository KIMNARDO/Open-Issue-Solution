import { useEffect, useRef, useState } from 'react';
import { ExAuth } from 'api/system/auth/auth.types';
import { Box } from '@mui/material';
import { RowDataBase } from 'components/grid/grid.types';
import NavList, { ListDataProps } from 'components/list/NavList';
import SelectBox from 'components/select/SelectBox';
import DeptTable from './section/DeptTable';
import DevTable from './section/DevTable';
import {
  useOpenIssueCategory,
  useOpenIssueMenu,
  useRegistGroup,
  useRemoveGroup,
  useUpdateGroup
} from 'api/qms/open-issue/useOpenIssueService';
import { SelectboxType } from 'components/select/selectbox.types';
import { OpenissueGroup, OpenissueGroupMember, OpenIssueMenu } from 'api/qms/open-issue/openIssue.types';
import { ContextMenu, ContextMenuOption, useContextMenu } from 'hooks/useContextMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import IssueCategoryDialog, { IssueCategoryDialogRef } from '../dialog/IssueCategoryDialog';
import CreateOpenIssue from '../create-open-issue';
import { handleServerError } from 'utils/error';
import { commonNotification } from 'api/common/notification';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from 'api/qms/open-issue/openIssue.query';
import dayjs from 'dayjs';
import { confirmation } from 'components/confirm/CommonConfirm';
import { DObject } from 'api/common/common.types';
import BasicLayout from 'layout/Basic';

export interface OpenIssueType extends RowDataBase, Partial<DObject> {
  oid: number;
  type: string;
  placeOfIssue?: string;
  productionSite?: string;
  oemLibNm: string;
  category: string;
  itemNm: string;
  projectNm: string;
  gateNum?: string;
  gateName?: string;
  contents?: string;
  assignedTo?: string;
  description: string;
  issueManagerNm?: string;
  issueManagers?: string[];
  managerNm?: string;
  managerTeam: string;
  management: string;
  report: string;
  importance: string;
  importanceNm: string;
  issueNo?: string;
  issueState?: string;
  issueStateNm?: string;
  issueType?: string;
  issueTypeArr?: string[];
  issueTypeNm?: string;
  openIssueType?: string;
  status: string;
  strDt: string;
  finDt: string;
  closeDt?: string;
  reStartDt?: string;
  duration: string;
  delayDt?: number;
  sop: string;
  volum?: string;
  salesYear?: string;
  replaceMembers?: string;
  predecessors?: string[];
  remark: string;
  deptProjectNm?: string;
  deptItemNm?: string;
  deptCustomerNm?: string;
  openIssueGroup?: number;
  openIssueGroupList?: number[];
  openIssueCategoryOid?: number;
  openIssueCategoryName?: string;
  openIssueManager?: OpenissueGroupMember[];
  groupCategoryOid?: number;
  isFileYn?: string;
  isCommentYn?: string;
}

export const initOpenIssue: OpenIssueType = {
  oid: -1,
  type: '',
  placeOfIssue: '',
  productionSite: '',
  oemLibNm: '',
  category: '',
  itemNm: '',
  projectNm: '',
  description: '',
  importance: '',
  importanceNm: '',
  status: '',
  strDt: dayjs().format('YYYY-MM-DD'),
  finDt: '',
  duration: '',
  sop: '',
  remark: '',
  managerTeam: '',
  management: 'false',
  report: ''
};

export interface AuthGridAreaRef {
  getUpdatedGroupAuth: () => ExAuth[];
}

export type OpenIssueMode = 'READ' | 'WRITE';

export const importanceList = [
  { label: '하', value: '1' },
  { label: '중', value: '2' },
  { label: '상', value: '3' },
  { label: '지시사항', value: '4' },
  { label: '긴급', value: '5' }
];

const findNodeByKey = (tree: OpenIssueMenu[], key: string | number): OpenIssueMenu | null => {
  for (const node of tree) {
    if (node.key == key) {
      return node;
    }
    if (node.children) {
      const result = findNodeByKey(node.children, key);
      if (result) {
        return result;
      }
    }
  }
  return null;
};

const findParentByKey = (tree: OpenIssueMenu[], key: string | number): OpenIssueMenu | null => {
  for (const node of tree) {
    if (node.children) {
      const result = findNodeByKey(node.children, key);
      if (result) {
        return node;
      }
    }
  }
  return null;
};

const OpenIssue = () => {
  const [mode, setMode] = useState<OpenIssueMode>('READ');
  const [selectedPlace, setSelectedPlace] = useState<string>('DEPT');
  const [filterDataArr, setFilterDataArr] = useState<ListDataProps[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [targetGroup, setTargetGroup] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [currentIssueGroupNm, setCurrentIssueGroupNm] = useState<string>('');

  const issueCategoryDialogRef = useRef<IssueCategoryDialogRef>(null);

  const queryClient = useQueryClient();

  const { handleOpen, handleClose, mouseX, mouseY, menuOpen } = useContextMenu({});

  const { data: openIssueMenu, refetch: refetchOpenIssueMenu } = useOpenIssueMenu(selectedPlace);
  const { data: openIssueCategory } = useOpenIssueCategory();

  const { mutate: registGroup } = useRegistGroup();
  const { mutate: updateGroup } = useUpdateGroup();
  const { mutate: removeGroup } = useRemoveGroup();

  const resetGroupState = () => {
    setSelectedGroup('');
    setSelectedTeam('');
    setCurrentIssueGroupNm('');
  };

  const onItemClick = (url: string, text: string, menus?: OpenIssueMenu[]) => {
    const parent = findParentByKey(menus || openIssueMenu || [], url);
    if (!parent) {
      setSelectedTeam(url);
      setSelectedGroup('');
      return;
    } else {
      setSelectedGroup(url);
      setCurrentIssueGroupNm(text);
    }
    setSelectedTeam(parent.key);
  };

  const handleRegistGroup = (values: Partial<OpenissueGroup>) => {
    registGroup(
      { ...values, groupType: selectedPlace },
      {
        onSuccess: (result) => {
          commonNotification.success('등록되었습니다');
          refetchOpenIssueMenu().then((menus) => {
            onItemClick(result.oid.toString(), result.name, menus.data);
          });
          issueCategoryDialogRef.current?.close();
        },
        onError: (error) => handleServerError(error)
      }
    );
  };

  const handleUpdateGroup = (values: OpenissueGroup) => {
    updateGroup(values, {
      onSuccess: () => {
        commonNotification.success('저장되었습니다');
        refetchOpenIssueMenu();
        queryClient.invalidateQueries({ queryKey: queryKeys.openIssueGroupDetail(Number(targetGroup)) });
        queryClient.invalidateQueries({ queryKey: queryKeys.openIssueMember({ fromOid: Number(targetGroup) }) });
        queryClient.invalidateQueries({ queryKey: queryKeys.openIssueGroupCategory(Number(targetGroup)) });
        queryClient.invalidateQueries({
          queryKey: queryKeys.openIssues({
            openIssueType: selectedPlace,
            openIssueGroup: Number(selectedTeam),
            openIssueCategoryOid: Number(targetGroup)
          })
        });
        issueCategoryDialogRef.current?.close();
      },
      onError: (error) => handleServerError(error)
    });
  };

  const handleRemoveGroup = async () => {
    const result = await confirmation({
      title: '그룹 삭제',
      msg: '삭제하시겠습니까?'
    });
    if (!result) return;
    removeGroup(targetGroup, {
      onSuccess: () => {
        commonNotification.success('삭제되었습니다');
        refetchOpenIssueMenu();
        if (selectedGroup === targetGroup) {
          resetGroupState();
        }
      },
      onError: (error) => handleServerError(error)
    });
  };

  // const handleRegistGroupConfirm = (values: CategoryFormValues) => {
  //   handleRegistGroup(values.name);
  // };

  const contextMenuItems: ContextMenuOption[] = [
    {
      label: '상세정보',
      onClick: () => {
        issueCategoryDialogRef.current?.open();
      },
      icon: <FontAwesomeIcon icon={faInfoCircle} />,
      disabled: !targetGroup || targetGroup.length < 1
    },
    {
      label: '추가',
      onClick: () => {
        issueCategoryDialogRef.current?.openRegist();
      },
      icon: <FontAwesomeIcon icon={faPlus} />
    },
    {
      label: '삭제',
      onClick: handleRemoveGroup,
      icon: <FontAwesomeIcon icon={faTrash} />,
      disabled: !findParentByKey(openIssueMenu || [], targetGroup)
    }
  ];

  useEffect(() => {
    const dataArr =
      openIssueMenu?.map<ListDataProps>((e) => ({
        text: e.title,
        url: e.key,
        children: e.children?.map((c) => ({ text: c.title, url: c.key })),
        isParent: true
      })) || [];

    setFilterDataArr(dataArr);
  }, [selectedPlace, openIssueMenu]);

  switch (mode) {
    case 'READ':
      return (
        <>
          <BasicLayout>
            <Box display={'flex'} height={'100%'}>
              <Box flex={'0 1 15vw'} p={1} minWidth={200} display={'flex'} flexDirection={'column'}>
                <Box pb={1}>
                  <SelectBox
                    value={selectedPlace}
                    onChange={(e) => {
                      setSelectedPlace(e.target.value);
                    }}
                    name="listSet"
                    label="Open Issue"
                    selectProps={{
                      items: (openIssueCategory || []).map<SelectboxType>((el) => ({ label: el.korNm ?? '', value: el.name }))
                    }}
                  />
                </Box>
                <Box overflow={'auto'} flex={1}>
                  <NavList
                    dataArr={filterDataArr}
                    onItemClick={onItemClick}
                    onItemContextMenu={(e, url) => {
                      if (selectedPlace !== 'DEPT') return;
                      handleOpen(e);
                      setTargetGroup(url);
                    }}
                  />
                </Box>
              </Box>
              {selectedPlace === 'DEPT' ? (
                <DeptTable
                  selectedGroup={selectedGroup}
                  selectedTeam={selectedTeam}
                  selectedPlace={selectedPlace}
                  currentIssueGroupNm={currentIssueGroupNm}
                />
              ) : (
                <DevTable setMode={setMode} selectedGroup={selectedGroup} selectedTeam={selectedTeam} />
              )}
              {/* {isDept ? <DeptTable currentFilter={currentFilter} /> : <DevTable setMode={setMode} />} */}
            </Box>
            <ContextMenu options={contextMenuItems} mouseX={mouseX} mouseY={mouseY} open={menuOpen} onClose={handleClose} />
            <IssueCategoryDialog
              selectedGroup={Number(targetGroup)}
              selectedPlace={selectedPlace}
              onRegist={handleRegistGroup}
              onSave={handleUpdateGroup}
              ref={issueCategoryDialogRef}
            />
          </BasicLayout>
        </>
      );
    case 'WRITE':
      return <CreateOpenIssue selectedGroup={selectedGroup} setMode={setMode} />;
    default:
      return <>set mode</>;
  }
};

export default OpenIssue;
