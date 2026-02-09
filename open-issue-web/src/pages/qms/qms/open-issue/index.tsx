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
import { useIntl } from 'react-intl';
import useConfig from 'hooks/useConfig';
import * as AntIcons from '@ant-design/icons';
import React from 'react';

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

// 중요도 리스트 - labelKey는 번역 키
export const importanceList = [
  { label: '하', labelKey: 'importance-low', value: '1' },
  { label: '중', labelKey: 'importance-medium', value: '2' },
  { label: '상', labelKey: 'importance-high', value: '3' },
  { label: '지시사항', labelKey: 'importance-instruction', value: '4' },
  { label: '긴급', labelKey: 'importance-urgent', value: '5' }
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

// 메뉴 아이콘 매핑 (키 → Ant Design 아이콘명 + 팀 색상)
const menuIconConfig: Record<string, { icon: string; color: string }> = {
  // ===== 부서별 (DEPT) 부모 =====
  '1': { icon: 'ShoppingOutlined', color: '#1890ff' },            // 영업팀
  '2': { icon: 'SafetyCertificateOutlined', color: '#f5222d' },   // 품질관리팀
  '3': { icon: 'ToolOutlined', color: '#722ed1' },                // 기술팀
  '4': { icon: 'FundOutlined', color: '#d4b106' },                // 경영기획팀
  '5': { icon: 'ShoppingCartOutlined', color: '#52c41a' },        // 구매팀
  '6': { icon: 'BuildOutlined', color: '#fa8c16' },               // 생산팀
  '7': { icon: 'LaptopOutlined', color: '#13c2c2' },              // IT팀
  '8': { icon: 'GlobalOutlined', color: '#2f54eb' },              // 해외법인
  // 영업팀 하위
  '11': { icon: 'RocketOutlined', color: '#1890ff' },             // 수주 추진
  '12': { icon: 'FileSearchOutlined', color: '#1890ff' },         // 기술 검토
  '13': { icon: 'DollarOutlined', color: '#1890ff' },             // 단가 조정
  '14': { icon: 'UserAddOutlined', color: '#1890ff' },            // 신규 고객 개발
  '15': { icon: 'AuditOutlined', color: '#1890ff' },              // 견적 관리
  '16': { icon: 'StopOutlined', color: '#1890ff' },               // 단종 관리
  // 품질관리팀 하위
  '21': { icon: 'BugOutlined', color: '#f5222d' },                // 품질 이슈
  '22': { icon: 'AlertOutlined', color: '#f5222d' },              // 클레임 대응
  '23': { icon: 'EyeOutlined', color: '#f5222d' },                // 고객 감사
  '24': { icon: 'CheckCircleOutlined', color: '#f5222d' },        // 내부 품질
  '25': { icon: 'PieChartOutlined', color: '#f5222d' },           // 불량 분석
  // 기술팀 하위
  '31': { icon: 'SearchOutlined', color: '#722ed1' },             // 기술 검토
  '32': { icon: 'SyncOutlined', color: '#722ed1' },               // TR 대응
  '33': { icon: 'EditOutlined', color: '#722ed1' },               // 설계 변경
  '34': { icon: 'ExperimentOutlined', color: '#722ed1' },         // 시험 평가
  '35': { icon: 'ThunderboltOutlined', color: '#722ed1' },        // 양산 지원
  // 경영기획팀 하위
  '41': { icon: 'BankOutlined', color: '#d4b106' },               // M&A 추진
  '42': { icon: 'BarChartOutlined', color: '#d4b106' },           // 매출 관리
  '43': { icon: 'FundProjectionScreenOutlined', color: '#d4b106' }, // 투자 계획
  '44': { icon: 'AimOutlined', color: '#d4b106' },                // 사업 전략
  '45': { icon: 'SoundOutlined', color: '#d4b106' },              // 회사 홍보
  // 구매팀 하위
  '51': { icon: 'DatabaseOutlined', color: '#52c41a' },           // 원소재 관리
  '52': { icon: 'TeamOutlined', color: '#52c41a' },               // 협력업체 관리
  '53': { icon: 'ClockCircleOutlined', color: '#52c41a' },        // 납기 관리
  '54': { icon: 'FallOutlined', color: '#52c41a' },               // 원가 절감
  // 생산팀 하위
  '61': { icon: 'WarningOutlined', color: '#fa8c16' },            // 양산 이슈
  '62': { icon: 'ControlOutlined', color: '#fa8c16' },            // 설비 관리
  '63': { icon: 'AppstoreAddOutlined', color: '#fa8c16' },        // 라인 증설
  '64': { icon: 'RiseOutlined', color: '#fa8c16' },               // 생산성 향상
  // IT팀 하위
  '71': { icon: 'CloudServerOutlined', color: '#13c2c2' },        // ERP 관리
  '72': { icon: 'CodeOutlined', color: '#13c2c2' },               // 시스템 개선
  '73': { icon: 'LockOutlined', color: '#13c2c2' },               // 보안 관리
  // 해외법인 하위
  '81': { icon: 'GlobalOutlined', color: '#2f54eb' },             // 인도법인
  '82': { icon: 'GlobalOutlined', color: '#2f54eb' },             // 중국법인
  '83': { icon: 'GlobalOutlined', color: '#2f54eb' },             // 태국법인
  // ===== 개발별 (DEV) 부모 =====
  '100': { icon: 'ThunderboltOutlined', color: '#eb2f96' },       // HV PTC Heater
  '200': { icon: 'BulbOutlined', color: '#fa541c' },              // LV PTC Heater
  '300': { icon: 'FilterOutlined', color: '#1890ff' },            // Coolant Valve
  '400': { icon: 'FireOutlined', color: '#f5222d' },              // Coolant Heater
  '500': { icon: 'CloudOutlined', color: '#13c2c2' },             // Air PTC Heater
  '600': { icon: 'DesktopOutlined', color: '#722ed1' },           // Control Unit
  '700': { icon: 'SettingOutlined', color: '#52c41a' }            // Actuator
};

const getMenuIcon = (key: string, size: number): React.ReactNode | undefined => {
  let config = menuIconConfig[key];
  // DEV 프로젝트 자식: 부모 색상 상속 + ExperimentOutlined
  if (!config) {
    const parentKey = (Math.floor(Number(key) / 100) * 100).toString();
    const parentConfig = menuIconConfig[parentKey];
    if (parentConfig) {
      config = { icon: 'ExperimentOutlined', color: parentConfig.color };
    }
  }
  if (!config) return undefined;
  const IconComp = (AntIcons as any)[config.icon];
  if (!IconComp) return undefined;
  const badgeSize = size + 12;
  return (
    <span
      style={{
        width: badgeSize,
        height: badgeSize,
        borderRadius: 8,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: `${config.color}20`,
        color: config.color,
        flexShrink: 0
      }}
    >
      <IconComp style={{ fontSize: size }} />
    </span>
  );
};

const OpenIssue = () => {
  const [mode, setMode] = useState<OpenIssueMode>('READ');
  const [selectedPlace, setSelectedPlace] = useState<string>('DEPT');
  const [filterDataArr, setFilterDataArr] = useState<ListDataProps[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [targetGroup, setTargetGroup] = useState<string>('');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [currentIssueGroupNm, setCurrentIssueGroupNm] = useState<string>('');

  const intl = useIntl();
  const { formatMessage } = intl;

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
          commonNotification.success(formatMessage({ id: 'msg-registered' }));
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
        commonNotification.success(formatMessage({ id: 'msg-saved' }));
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
      title: formatMessage({ id: 'dialog-group-delete' }),
      msg: formatMessage({ id: 'dialog-confirm-delete' })
    });
    if (!result) return;
    removeGroup(targetGroup, {
      onSuccess: () => {
        commonNotification.success(formatMessage({ id: 'msg-deleted' }));
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
      label: formatMessage({ id: 'btn-detail' }),
      onClick: () => {
        issueCategoryDialogRef.current?.open();
      },
      icon: <FontAwesomeIcon icon={faInfoCircle} />,
      disabled: !targetGroup || targetGroup.length < 1
    },
    {
      label: formatMessage({ id: 'btn-add' }),
      onClick: () => {
        issueCategoryDialogRef.current?.openRegist();
      },
      icon: <FontAwesomeIcon icon={faPlus} />
    },
    {
      label: formatMessage({ id: 'btn-delete' }),
      onClick: handleRemoveGroup,
      icon: <FontAwesomeIcon icon={faTrash} />,
      disabled: !findParentByKey(openIssueMenu || [], targetGroup)
    }
  ];

  useEffect(() => {
    const dataArr =
      openIssueMenu?.map<ListDataProps>((e) => ({
        text: e.labelKey ? formatMessage({ id: e.labelKey }) : e.title,
        url: e.key,
        icon: getMenuIcon(e.key, 20),
        children: e.children?.map((c) => ({
          text: c.labelKey ? formatMessage({ id: c.labelKey }) : c.title,
          url: c.key,
          icon: getMenuIcon(c.key, 16)
        })),
        isParent: true
      })) || [];

    setFilterDataArr(dataArr);

    // 메뉴 로드 시 첫 번째 그룹 자동 선택
    if (openIssueMenu && openIssueMenu.length > 0 && !selectedGroup && !selectedTeam) {
      const firstTeam = openIssueMenu[0];
      if (firstTeam.children && firstTeam.children.length > 0) {
        const firstChild = firstTeam.children[0];
        setSelectedTeam(firstTeam.key);
        setSelectedGroup(firstChild.key);
        setCurrentIssueGroupNm(firstChild.labelKey ? formatMessage({ id: firstChild.labelKey }) : firstChild.title);
      } else {
        setSelectedTeam(firstTeam.key);
      }
    }
  }, [selectedPlace, openIssueMenu, formatMessage]);

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
                      resetGroupState();
                    }}
                    name="listSet"
                    label="Open Issue"
                    selectProps={{
                      items: (openIssueCategory || []).map<SelectboxType>((el) => ({
                        label: el.labelKey ? formatMessage({ id: el.labelKey }) : el.korNm ?? '',
                        value: el.name
                      }))
                    }}
                  />
                </Box>
                <Box overflow={'auto'} flex={1}>
                  <NavList
                    dataArr={filterDataArr}
                    onItemClick={onItemClick}
                    activeItem={selectedGroup}
                    selectedParent={selectedTeam}
                    defaultCollapsed={false}
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
