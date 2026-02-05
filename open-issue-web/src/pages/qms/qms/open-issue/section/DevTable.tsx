import { GetContextMenuItems, RowClassParams } from 'ag-grid-community';
import { commonNotification } from 'api/common/notification';
import { confirmation } from 'components/confirm/CommonConfirm';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { handleServerError } from 'utils/error';
import { OpenIssueMode, OpenIssueType } from '..';
import { FormikProps } from 'formik';
import { AgGridReact } from 'ag-grid-react';
import { useEditGrid } from 'components/grid/useEditGrid';
import { useOpenIssueList, useRemoveOpenIssue, useUpdateOpenIssue } from 'api/qms/open-issue/useOpenIssueService';
import useColumns from '../hook/useColumns';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import CommonButton from 'components/buttons/CommonButton';
import { Box, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faDownload, faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import CommonGrid from 'components/grid/CommonGrid';
import { useIntl } from 'react-intl';
import { useGridStateStore } from 'store/gridState.store';
import useConfig from 'hooks/useConfig';

const Toolbar = withSimpleSearchForm<any>(({ btnActions, formikProps }) => {
  const { formatMessage } = useIntl();
  const { i18n } = useConfig();

  return (
    <>
      <TextField
        name="code"
        placeholder={formatMessage({ id: 'placeholder-search' })}
        value={formikProps.values.code}
        onChange={formikProps.handleChange}
      />
      <CommonButton title="검색" variant="standard" icon={<FontAwesomeIcon icon={faSearch} />} icononly="true" />
      <CommonButton
        title={formatMessage({ id: 'btn-download' })}
        variant="outlined"
        onClick={() => btnActions.download()}
        icon={<FontAwesomeIcon icon={faDownload} />}
      />
      <CommonButton
        title={formatMessage({ id: 'btn-newIssue' })}
        variant="outlined"
        onClick={() => btnActions.add()}
        icon={<FontAwesomeIcon icon={faPlus} />}
      />
      <CommonButton
        title={formatMessage({ id: 'btn-save' })}
        variant="contained"
        onClick={() => btnActions.save()}
        icon={<FontAwesomeIcon icon={faSave} />}
        disabled={i18n !== 'ko'} // TODO : 제거 필요
      />
    </>
  );
});

const DevTable = ({
  setMode,
  selectedGroup,
  selectedTeam
}: {
  setMode: Dispatch<SetStateAction<OpenIssueMode>>;
  selectedGroup: string;
  selectedTeam: string;
}) => {
  const [rowData, setRowData] = useState<OpenIssueType[]>([]);
  const gridId = `devOIL-${selectedTeam}`;

  const groupGridRef = useRef<AgGridReact<OpenIssueType>>(null);
  const toolbarRef = useRef<FormikProps<any>>(null);

  const { formatMessage } = useIntl();
  const { updateState, state } = useGridStateStore();

  const { onUpdateCells, getUpdatedRows, exportToExcel } = useEditGrid(groupGridRef);

  const { data, refetch, isFetching } = useOpenIssueList({ openIssueType: 'DEV', openIssueGroup: Number(selectedGroup) });

  const { openIssueColumns } = useColumns({});

  const { mutate: updateOpenIssue } = useUpdateOpenIssue();
  const { mutate: removeOpenIssue } = useRemoveOpenIssue();

  const updateGridState = (): void => {
    if (!groupGridRef.current || !groupGridRef.current.api) return;

    updateState(groupGridRef.current.api, gridId);
  };

  const btnActions = {
    save: () => {
      updateGridState();
      if (getUpdatedRows().length < 1) {
        commonNotification.warn('수정된 데이터가 없습니다.');
        return;
      }
      updateOpenIssue(
        getUpdatedRows().map((el) => ({
          ...el,
          replaceMembers: el.predecessors?.join(',')
        })),
        {
          onSuccess: () => {
            commonNotification.success('저장되었습니다');
            refetch();
          },
          onError: (error) => handleServerError(error)
        }
      );
    },
    add: () => {
      if (!selectedGroup || selectedGroup.length < 1) {
        commonNotification.warn('그룹을 선택해주세요.');
        return;
      }
      setMode('WRITE');
    },
    download: () => {
      exportToExcel({ title: 'Open Issue 현황' });
    }
  };

  const getContextMenuItems: GetContextMenuItems = useCallback(({ node }) => {
    if (!node) return [];
    return [
      {
        name: '이슈 삭제',
        action: async ({ node }) => {
          if (!node || !node.data) return;

          const result = await confirmation({
            title: '이슈 삭제',
            msg: '선택한 이슈를 삭제하시겠습니까?'
          });

          if (!result) return;

          removeOpenIssue(node.data.oid, {
            onSuccess: () => {
              commonNotification.success('삭제되었습니다');
              refetch();
            },
            onError: (error) => handleServerError(error)
          });
        }
      }
    ];
  }, []);

  const getRowClass = ({ data }: RowClassParams) => {
    if (!data || !data.issueState) return undefined;
    return data.issueState.toString() === '78106' ? 'disabled-row' : '';
  };

  useEffect(() => {
    if (data && selectedGroup) {
      setRowData(
        data?.map((el) => ({
          ...el,
          issueTypeArr: el.issueType?.split(',') ?? [],
          predecessors: el.replaceMembers?.split(',')
        })) || []
      );
    }
  }, [data, selectedGroup]);

  useEffect(() => {
    if (groupGridRef.current?.api) {
      state[gridId]
        ? groupGridRef.current.api.applyColumnState({ state: state[gridId], applyOrder: true })
        : groupGridRef.current.api.resetColumnState();
    }
  }, [gridId]);

  return (
    <Box p={1} pb={0} display={'flex'} flexDirection={'column'} flex={'0 1 85vw'}>
      <Toolbar
        title={formatMessage({ id: 'devOILTitle' })}
        ref={toolbarRef}
        btnActions={btnActions}
        onSubmit={(values) => {}}
        initialValues={{}}
        direction="end"
      />
      <CommonGrid
        ref={groupGridRef}
        gridProps={{
          columnDefs: openIssueColumns,
          rowData: rowData,
          onCellValueChanged: onUpdateCells,
          pagination: true,
          paginationPageSize: 50,
          paginationPageSizeSelector: [10, 20, 50, 100],
          getContextMenuItems: getContextMenuItems,
          loading: isFetching,
          getRowClass: getRowClass,
          context: {
            id: gridId
          }
        }}
        autoSizeMode={'fullWidth'}
      />
    </Box>
  );
};

export default DevTable;
