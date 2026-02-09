import DirectCheckboxRenderer from 'components/cellEditor/DirectCheckbox';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import { getGridComboBoxOptions, getGridMultiComboBoxOptions } from 'components/cellEditor/SelectEditor';
import { commonDateFormatter, emptyValueFormatter, issueDelayFormatter, issueDurationFormatter } from 'components/grid/valueformatter';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { importanceList, OpenIssueType } from '..';
import { CellStyle, GridApi, IRowNode } from 'ag-grid-community';
import { useUsers } from 'api/system/user/useUserService';
import { gateList } from 'pages/qms/qms/create-open-issue/section/MainForm';
import { useIntl } from 'react-intl';
import useLibrary from 'hooks/useLibrary';
import UserSearchRenderer from 'components/cellEditor/UserSearchRenderer';
import useAuth from 'hooks/useAuth';
import SearchInputRenderer from 'components/cellEditor/SearchInputRenderer';
import { useOpenIssueGroupCategory, useOpenIssueMember } from 'api/qms/open-issue/useOpenIssueService';
import { OpenissueGroupMember } from 'api/qms/open-issue/openIssue.types';
import { useQuery } from '@tanstack/react-query';
import { codeLibQueryOptions } from 'api/system/library/library.query';
import MultiFileUploadRenderer from 'components/cellEditor/MultiFileUploadRenderer';
import { OpenIssueEtcStatusRenderer, OpenIssueEtcStatusHeader } from 'components/cellEditor/OpenIssueEtcStatusRenderer';
import MultilineRenderer from 'components/cellEditor/MultilineRenderer';
import { ImportanceRenderer } from 'components/cellEditor/ImportanceRenderer';
import { IssueStatusRenderer } from 'components/cellEditor/IssueStatusRenderer';

interface DevColumnOptions {}
interface DeptColumnOptions {
  openFileUploader?: (data: OpenIssueType) => void;
  onFileClick?: (data: OpenIssueType) => void;
  onCommentClick?: (data: OpenIssueType) => void;
}

interface UseColumnsProps {
  actions?: { [k: string]: (node: IRowNode) => void };
  selectedGroup?: number;
  devOption?: DevColumnOptions;
  deptOption?: DeptColumnOptions;
}

const commonCellStyle: CellStyle = {
  alignItems: 'center',
  display: 'inline-flex',
  justifyContent: 'center'
};

const useColumns = ({ actions, selectedGroup, devOption, deptOption }: UseColumnsProps) => {
  const { user } = useAuth();
  const { formatMessage } = useIntl();

  const { librarySelect } = useLibrary();

  const { data: users } = useUsers({});
  const { data: libraryChildList } = useQuery(codeLibQueryOptions.selectChildListCodeLibrary(user?.departmentOid?.toString() || ''));
  const { data: memberList } = useOpenIssueMember({
    fromOid: selectedGroup
  });
  const { data: categoryList } = useOpenIssueGroupCategory(selectedGroup ?? -1);

  const libChildColumns = useMemo<(ExColDef | ExColGroupDef)[]>(
    () => [
      {
        field: 'no',
        headerName: 'No',
        editable: false,
        minWidth: 30,
        cellDataType: 'index'
      },
      {
        field: 'name',
        headerName: formatMessage({ id: 'col-issue-name' }),
        editable: false,
        minWidth: 100
      }
    ],
    [formatMessage]
  );

  const selectOptions = useMemo(() => {
    // 중요도 리스트 번역 적용
    const translatedImportance = importanceList.map((item) => ({
      label: item.labelKey ? formatMessage({ id: item.labelKey }) : item.label,
      value: item.value
    }));

    // 구분(내부/고객) 번역 매핑
    const placeOfIssueKeyMap: Record<string, string> = {
      '내부': 'type-internal',
      '고객': 'type-customer'
    };

    // 양산처/지역 번역 매핑
    const productionSiteKeyMap: Record<string, string> = {
      '인도': 'site-india',
      '일본': 'site-japan',
      '중국': 'site-china',
      '한국': 'site-korea',
      '본사': 'site-hq',
      '유럽': 'site-europe',
      '해외': 'site-overseas',
      '태국': 'site-thailand'
    };

    // 구분 옵션 번역
    const translatedPlaceOfIssue = (librarySelect?.placeOfIssue || []).map((item) => ({
      ...item,
      label: placeOfIssueKeyMap[item.label] ? formatMessage({ id: placeOfIssueKeyMap[item.label] }) : item.label
    }));

    // 양산처/지역 옵션 번역
    const translatedProductionSite = (librarySelect?.productionSite || []).map((item) => ({
      ...item,
      label: productionSiteKeyMap[item.label] ? formatMessage({ id: productionSiteKeyMap[item.label] }) : item.label
    }));

    // 이슈 상태 번역 매핑
    const issueStateKeyMap: Record<string, string> = {
      '진행': 'issue-state-open',
      '진행중': 'issue-state-open',
      '완료': 'issue-state-closed',
      '대기': 'issue-state-pending'
    };

    // 이슈 상태 옵션 번역
    const translatedIssueState = (librarySelect?.issueState || []).map((item) => ({
      ...item,
      label: issueStateKeyMap[item.label] ? formatMessage({ id: issueStateKeyMap[item.label] }) : item.label
    }));

    return {
      issueState: translatedIssueState,
      issueType: librarySelect?.issueType || [],
      item: librarySelect?.item || [],
      oem: librarySelect?.oem || [],
      placeOfIssue: translatedPlaceOfIssue,
      productionSite: translatedProductionSite,
      importance: translatedImportance,
      users: users?.filter((el) => el.name && el.oid).map((item) => ({ label: item.name!, value: item.oid!.toString() })) || [],
      groupCategories: categoryList?.map((item) => ({ label: item.value, value: item.oid.toString() })) || []
    };
  }, [librarySelect, users, categoryList, formatMessage]);

  const openIssueColumns = useMemo<(ExColDef | ExColGroupDef)[]>(
    () => [
      {
        field: 'placeOfIssue',
        headerName: formatMessage({ id: 'col-type' }),
        editable: true,
        maxWidth: 100,
        ...getGridComboBoxOptions(selectOptions.placeOfIssue)
      },
      {
        field: 'productionSite',
        headerName: formatMessage({ id: 'col-productionsite' }),
        editable: true,
        maxWidth: 120,
        ...getGridComboBoxOptions(selectOptions.productionSite)
      },
      { field: 'oemLibNm', headerName: formatMessage({ id: 'col-customer' }), editable: false, minWidth: 120, flex: 3 },
      // {
      //   field: 'issueType',
      //   headerName: 'Category',
      //   editable: true,
      //   minWidth: 120,
      //   ...getGridMultiComboBoxOptions(selectOptions.issueType)
      // },
      {
        field: 'issueType',
        headerName: formatMessage({ id: 'col-category' }),
        editable: true,
        minWidth: 120,
        ...getGridComboBoxOptions(selectOptions.issueType)
      },
      { field: 'itemNm', headerName: formatMessage({ id: 'col-item' }), editable: false, minWidth: 120 },
      { field: 'projectNm', headerName: formatMessage({ id: 'label-programNm' }), editable: false, minWidth: 120 },
      {
        field: 'gate',
        headerName: formatMessage({ id: 'col-gate-sales' }),
        editable: true,
        maxWidth: 70,
        ...getGridComboBoxOptions(gateList)
      },
      {
        field: 'description',
        headerName: formatMessage({ id: 'col-description' }),
        cellEditor: 'agLargeTextCellEditor',
        cellEditorPopup: true,
        cellEditorParams: {
          maxLength: 3000,
          rows: 15,
          cols: 50
        },
        // cellEditor: TipTapCellEditor,
        // suppressKeyboardEvent: (params) => {
        //   if (params.event.key === 'Enter') {
        //     return true;
        //   }
        //   return false;
        // },
        // cellEditorParams: {
        //   maxLength: 100
        // },
        editable: true,
        minWidth: 280
        // valueFormatter: ({ value }) => {
        //   if (!value) return '';
        //   return convertHTMLToText(value);
        // }
      },
      { field: 'managerNm', headerName: formatMessage({ id: 'col-manager-pm' }), editable: false, minWidth: 90 },
      {
        field: 'issueManagers',
        headerName: formatMessage({ id: 'col-manage-dept' }),
        editable: true,
        minWidth: 120,
        cellRenderer: UserSearchRenderer,
        cellRendererParams: {
          users: selectOptions.users
        }
      },
      {
        field: 'management',
        headerName: formatMessage({ id: 'col-report' }),
        editable: true,
        minWidth: 50,
        cellRenderer: DirectCheckboxRenderer,
        context: {
          checkboxOption: {
            valueType: 'trueFalse'
          }
        }
      },
      {
        field: 'importance',
        headerName: formatMessage({ id: 'col-priority' }),
        editable: true,
        minWidth: 90,
        cellRenderer: ImportanceRenderer,
        ...getGridComboBoxOptions(selectOptions.importance)
      },
      {
        field: 'issueState',
        headerName: formatMessage({ id: 'col-status' }),
        editable: ({ data }) => data.createUs === user?.oid,
        minWidth: 90,
        ...getGridComboBoxOptions(selectOptions.issueState)
      },
      {
        field: 'strDt',
        headerName: formatMessage({ id: 'col-start-date' }),
        editable: true,
        minWidth: 100,
        valueFormatter: commonDateFormatter,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor'
      },
      {
        field: 'finDt',
        headerName: formatMessage({ id: 'col-end-date' }),
        editable: true,
        minWidth: 100,
        valueFormatter: commonDateFormatter,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor'
      },
      {
        field: 'duration',
        headerName: formatMessage({ id: 'col-duration' }),
        editable: false,
        minWidth: 90,
        valueFormatter: ({ data }) => {
          return data.strDt && data.finDt ? `${dayjs(data.finDt).diff(data.strDt, 'day')}일` : '-';
        }
      },
      {
        field: 'sop',
        headerName: formatMessage({ id: 'col-sop' }),
        editable: true,
        minWidth: 100,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor',
        valueFormatter: commonDateFormatter
      },
      {
        field: 'predecessors',
        headerName: formatMessage({ id: 'col-replace-members' }),
        editable: true,
        minWidth: 120,
        ...getGridMultiComboBoxOptions(selectOptions.users)
      },
      { field: 'createUsNm', headerName: formatMessage({ id: 'col-create-user' }), editable: false, minWidth: 120 },
      { field: 'remark', headerName: formatMessage({ id: 'col-remark' }), editable: true, minWidth: 180 }
    ],
    [selectOptions, formatMessage({ id: 'korea' })]
  );

  // [deptProjectNm]
  // [deptItemNm]
  // [deptCustomerNm];

  const deptOILColumns = useMemo<ExColDef[]>(
    () => [
      {
        field: 'etcStatus',
        editable: false,
        cellRenderer: OpenIssueEtcStatusRenderer,
        cellRendererParams: {
          onCommentClick: deptOption?.onCommentClick,
          onFileClick: deptOption?.onFileClick
        },
        headerComponent: OpenIssueEtcStatusHeader,
        pinned: 'left',
        lockPinned: true,
        width: 100,
        maxWidth: 100,
        minWidth: 100,
        context: {
          exportOptions: {
            hide: true
          }
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'issueNo',
        headerName: 'No',
        cellDataType: 'number',
        editable: false,
        minWidth: 50,
        valueFormatter: emptyValueFormatter,
        cellStyle: commonCellStyle
      },
      {
        field: 'placeOfIssue',
        headerName: formatMessage({ id: 'col-type' }),
        editable: true,
        maxWidth: 100,
        ...getGridComboBoxOptions(selectOptions.placeOfIssue),
        filter: 'agSetColumnFilter',
        filterParams: {
          values: selectOptions.placeOfIssue.map((s) => s.value),
          valueFormatter: (params: any) => {
            const match = selectOptions.placeOfIssue.find((s) => s.value === params.value);
            return match?.label || params.value;
          }
        },
        cellClass: ({ data }) => {
          if (!data) return null;
          return data.isNew ? 'error-cell' : null;
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'productionSite',
        headerName: formatMessage({ id: 'col-region' }),
        editable: true,
        minWidth: 120,
        maxWidth: 120,
        ...getGridComboBoxOptions(selectOptions.productionSite),
        filter: 'agSetColumnFilter',
        filterParams: {
          values: selectOptions.productionSite.map((s) => s.value),
          valueFormatter: (params: any) => {
            const match = selectOptions.productionSite.find((s) => s.value === params.value);
            return match?.label || params.value;
          }
        },
        cellClass: ({ data }) => {
          if (!data) return null;
          return data.isNew ? 'error-cell' : null;
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'deptCustomerNm',
        headerName: formatMessage({ id: 'col-customer' }),
        editable: true,
        minWidth: 120,
        cellStyle: commonCellStyle
      },
      {
        field: 'issueType',
        headerName: formatMessage({ id: 'col-category' }),
        editable: true,
        minWidth: 120,
        ...getGridComboBoxOptions(selectOptions.issueType),
        filter: 'agSetColumnFilter',
        filterParams: {
          values: selectOptions.issueType.map((s) => s.value),
          valueFormatter: (params: any) => {
            const match = selectOptions.issueType.find((s) => s.value === params.value);
            return match?.label || params.value;
          }
        },
        cellClass: ({ data }) => {
          if (!data) return null;
          return data.isNew ? 'error-cell' : null;
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'groupCategoryOid',
        headerName: formatMessage({ id: 'col-group-category' }),
        editable: true,
        minWidth: 120,
        ...getGridComboBoxOptions(selectOptions.groupCategories),
        cellClass: ({ data }) => {
          if (!data) return null;
          return data.isNew ? 'error-cell' : null;
        },
        cellStyle: commonCellStyle
      },
      { field: 'deptProjectNm', headerName: formatMessage({ id: 'col-project' }), editable: true, minWidth: 120, cellStyle: commonCellStyle },
      {
        field: 'deptItemNm',
        headerName: formatMessage({ id: 'col-itemGroup' }),
        editable: true,
        minWidth: 120,
        cellStyle: commonCellStyle
      },
      {
        field: 'contents',
        headerName: formatMessage({ id: 'col-issues' }),
        editable: true,
        minWidth: 120,
        cellStyle: { ...commonCellStyle, justifyContent: 'start' }
      },
      {
        field: 'description',
        headerName: formatMessage({ id: 'col-description' }),
        cellRenderer: MultilineRenderer,
        cellEditor: 'agLargeTextCellEditor',
        cellEditorPopup: true,
        cellEditorParams: {
          maxLength: 3000,
          rows: 15,
          cols: 50
        },
        editable: true,
        minWidth: 280,
        cellClass: ({ data }) => {
          if (!data) return null;
          return data.isNew ? 'error-cell' : null;
        },
        context: {
          exportOptions: {
            disableFormatter: true
          }
        }
      },
      {
        field: 'management',
        headerName: formatMessage({ id: 'col-report' }),
        editable: true,
        minWidth: 50,
        cellRenderer: DirectCheckboxRenderer,
        valueFormatter: ({ value }) => {
          return value === 'true' ? 'Y' : 'N';
        },
        context: {
          checkboxOption: {
            valueType: 'trueFalse'
          }
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'importance',
        headerName: formatMessage({ id: 'col-priority' }),
        editable: true,
        minWidth: 90,
        cellRenderer: ImportanceRenderer,
        ...getGridComboBoxOptions(selectOptions.importance),
        filter: 'agSetColumnFilter',
        filterParams: {
          values: selectOptions.importance.map((s) => s.value),
          valueFormatter: (params: any) => {
            const match = selectOptions.importance.find((s) => s.value === params.value);
            return match?.label || params.value;
          }
        },
        cellStyle: commonCellStyle
      },
      { field: 'assignedTo', headerName: formatMessage({ id: 'col-assigned-to' }), editable: true, minWidth: 90, cellStyle: commonCellStyle },
      {
        field: 'openIssueManager',
        headerName: formatMessage({ id: 'col-manager' }),
        cellRenderer: SearchInputRenderer,
        cellDataType: 'object',
        context: {
          comparator: (a: any, b: any) => {
            if (Array.isArray(a) && Array.isArray(b)) {
              const aPersonNm = a.map((el) => el.personNm).join(',');
              const bPersonNm = b.map((el) => el.personNm).join(',');
              return aPersonNm.localeCompare(bPersonNm);
            }
            return 0;
          }
        },
        minWidth: 100,
        cellRendererParams: {
          idKey: 'toOID',
          valueKey: 'personNm',
          rowData: memberList || [],
          tableColDef: [
            { field: 'personNm', headerName: formatMessage({ id: 'col-name' }) },
            { field: 'departmentNm', headerName: formatMessage({ id: 'col-department' }) }
          ],
          handleSelect: (selected: OpenissueGroupMember[], data: any, api: GridApi) => {
            data.isUpdated = true;
            data.openIssueManager = selected;
            api.applyTransaction({
              update: [data]
            });
          }
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'issueState',
        headerName: formatMessage({ id: 'col-status' }),
        editable: ({ data }) => data.createUs === user?.oid,
        minWidth: 100,
        cellRenderer: IssueStatusRenderer,
        ...getGridComboBoxOptions(selectOptions.issueState),
        filter: 'agSetColumnFilter',
        filterParams: {
          values: selectOptions.issueState.map((s) => s.value),
          valueFormatter: (params: any) => {
            const match = selectOptions.issueState.find((s) => s.value === params.value);
            return match?.label || params.value;
          }
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'strDt',
        headerName: formatMessage({ id: 'col-start-date' }),
        editable: true,
        minWidth: 100,
        valueFormatter: commonDateFormatter,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor',
        cellStyle: commonCellStyle
      },
      {
        field: 'finDt',
        headerName: formatMessage({ id: 'col-end-date' }),
        editable: true,
        minWidth: 100,
        valueFormatter: commonDateFormatter,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor',
        cellStyle: commonCellStyle
      },
      {
        field: 'duration',
        headerName: formatMessage({ id: 'col-duration' }),
        editable: false,
        minWidth: 90,
        ...issueDurationFormatter(),
        cellStyle: commonCellStyle
      },
      {
        field: 'delay',
        headerName: formatMessage({ id: 'col-delay' }),
        editable: false,
        minWidth: 90,
        ...issueDelayFormatter(),
        cellStyle: commonCellStyle
      },
      {
        field: 'sop',
        headerName: formatMessage({ id: 'col-sop' }),
        editable: true,
        minWidth: 100,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor',
        valueFormatter: commonDateFormatter,
        cellStyle: commonCellStyle
      },
      { field: 'volum', headerName: formatMessage({ id: 'col-volum' }), editable: true, minWidth: 100, cellStyle: commonCellStyle },
      { field: 'salesYear', headerName: formatMessage({ id: 'col-sales-year' }), editable: true, minWidth: 100, cellStyle: commonCellStyle },
      {
        field: 'createDt',
        headerName: formatMessage({ id: 'col-create-dt' }),
        editable: false,
        minWidth: 120,
        valueFormatter: (props) => {
          if (props.data?.isNew) return '-';
          return commonDateFormatter(props);
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'files',
        headerName: formatMessage({ id: 'col-files' }),
        editable: false,
        minWidth: 120,
        cellRenderer: MultiFileUploadRenderer,
        cellRendererParams: {
          openFileUploader: deptOption?.openFileUploader,
          editable: true
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'createUsNm',
        headerName: formatMessage({ id: 'col-create-user' }),
        editable: false,
        minWidth: 120,
        cellStyle: commonCellStyle
      }
    ],
    [selectOptions, formatMessage({ id: 'korea' }), libraryChildList, libChildColumns, memberList]
  );

  return {
    openIssueColumns,
    deptOILColumns
  };
};

export default useColumns;
