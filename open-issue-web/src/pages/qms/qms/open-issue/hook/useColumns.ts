import DirectCheckboxRenderer from 'components/cellEditor/DirectCheckbox';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import { getGridComboBoxOptions, getGridMultiComboBoxOptions } from 'components/cellEditor/SelectEditor';
import { commonDateFormatter, emptyValueFormatter, issueDelayFormatter, issueDurationFormatter } from 'components/grid/valueformatter';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { importanceList, OpenIssueType } from '..';
import { CellStyle, GridApi, IRowNode } from 'ag-grid-community';
import { useUsers } from 'api/system/user/useUserService';
import { gateList } from 'pages/qms/create-open-issue/section/MainForm';
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
        headerName: '이슈명',
        editable: false,
        minWidth: 100
      }
    ],
    []
  );

  const { formatMessage } = useIntl();

  const selectOptions = useMemo(() => {
    return {
      issueState: librarySelect?.issueState || [],
      issueType: librarySelect?.issueType || [],
      item: librarySelect?.item || [],
      oem: librarySelect?.oem || [],
      placeOfIssue: librarySelect?.placeOfIssue || [],
      productionSite: librarySelect?.productionSite || [],
      importance: importanceList,
      users: users?.filter((el) => el.name && el.oid).map((item) => ({ label: item.name!, value: item.oid!.toString() })) || [],
      groupCategories: categoryList?.map((item) => ({ label: item.value, value: item.oid.toString() })) || []
    };
  }, [librarySelect, users, categoryList]);

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
        headerName: 'Category',
        editable: true,
        minWidth: 120,
        ...getGridComboBoxOptions(selectOptions.issueType)
      },
      { field: 'itemNm', headerName: 'Item', editable: false, minWidth: 120 },
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
      { field: 'importance', headerName: 'Priority', editable: true, minWidth: 90, ...getGridComboBoxOptions(selectOptions.importance) },
      {
        field: 'issueState',
        headerName: 'Status',
        editable: ({ data }) => data.createUs === user?.oid,
        minWidth: 90,
        ...getGridComboBoxOptions(selectOptions.issueState)
      },
      {
        field: 'strDt',
        headerName: 'Start Date',
        editable: true,
        minWidth: 100,
        valueFormatter: commonDateFormatter,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor'
      },
      {
        field: 'finDt',
        headerName: 'End Date',
        editable: true,
        minWidth: 100,
        valueFormatter: commonDateFormatter,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor'
      },
      {
        field: 'duration',
        headerName: 'Duration',
        editable: false,
        minWidth: 90,
        valueFormatter: ({ data }) => {
          return data.strDt && data.finDt ? `${dayjs(data.finDt).diff(data.strDt, 'day')}일` : '-';
        }
      },
      {
        field: 'sop',
        headerName: 'SOP',
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
        headerName: 'Category',
        editable: true,
        minWidth: 120,
        ...getGridComboBoxOptions(selectOptions.issueType),
        cellClass: ({ data }) => {
          if (!data) return null;
          return data.isNew ? 'error-cell' : null;
        },
        cellStyle: commonCellStyle
      },
      {
        field: 'groupCategoryOid',
        headerName: 'groupCategory',
        editable: true,
        minWidth: 120,
        ...getGridComboBoxOptions(selectOptions.groupCategories),
        cellClass: ({ data }) => {
          if (!data) return null;
          return data.isNew ? 'error-cell' : null;
        },
        cellStyle: commonCellStyle
      },
      { field: 'deptProjectNm', headerName: 'Project', editable: true, minWidth: 120, cellStyle: commonCellStyle },
      {
        field: 'deptItemNm',
        headerName: formatMessage({ id: 'col-itemGroup' }),
        editable: true,
        minWidth: 120,
        cellStyle: commonCellStyle
      },
      {
        field: 'contents',
        headerName: 'Issues',
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
        headerName: 'Priority',
        editable: true,
        minWidth: 90,
        ...getGridComboBoxOptions(selectOptions.importance),
        cellStyle: commonCellStyle
      },
      { field: 'assignedTo', headerName: 'AssignedTo', editable: true, minWidth: 90, cellStyle: commonCellStyle },
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
            { field: 'personNm', headerName: '이름' },
            { field: 'departmentNm', headerName: '부서' }
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
        headerName: 'Status',
        editable: ({ data }) => data.createUs === user?.oid,
        minWidth: 90,
        ...getGridComboBoxOptions(selectOptions.issueState),
        cellStyle: commonCellStyle
      },
      {
        field: 'strDt',
        headerName: 'Start Date',
        editable: true,
        minWidth: 100,
        valueFormatter: commonDateFormatter,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor',
        cellStyle: commonCellStyle
      },
      {
        field: 'finDt',
        headerName: 'End Date',
        editable: true,
        minWidth: 100,
        valueFormatter: commonDateFormatter,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor',
        cellStyle: commonCellStyle
      },
      {
        field: 'duration',
        headerName: 'Duration',
        editable: false,
        minWidth: 90,
        ...issueDurationFormatter(),
        cellStyle: commonCellStyle
      },
      {
        field: 'delay',
        headerName: 'Delay',
        editable: false,
        minWidth: 90,
        ...issueDelayFormatter(),
        cellStyle: commonCellStyle
      },
      {
        field: 'sop',
        headerName: 'SOP',
        editable: true,
        minWidth: 100,
        cellDataType: 'dateString',
        cellEditor: 'agDateStringCellEditor',
        valueFormatter: commonDateFormatter,
        cellStyle: commonCellStyle
      },
      { field: 'volum', headerName: 'Volum', editable: true, minWidth: 100, cellStyle: commonCellStyle },
      { field: 'salesYear', headerName: 'Sales/Year', editable: true, minWidth: 100, cellStyle: commonCellStyle },
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
        headerName: formatMessage({ id: '파일' }),
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
