import {
  faSearch,
  faDownload,
  faPlus,
  faSave,
  faRotateBackward,
  faTrashCan,
  faCloudUpload,
  faPaperclip,
  faUpload,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, IconButton, TextField, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { LayoutList, LayoutGrid, FileText } from 'lucide-react';
import { AgGridReact } from 'ag-grid-react';
import CommonButton from 'components/buttons/CommonButton';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import CommonGrid from 'components/grid/CommonGrid';
import { FormikProps } from 'formik';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { importanceList, initOpenIssue, OpenIssueType } from '..';
import useColumns from '../hook/useColumns';
import { useEditGrid } from 'components/grid/useEditGrid';
import { GetContextMenuItemsParams, IRowNode, RowClassParams, RowSelectionOptions } from 'ag-grid-community';
import { useOpenIssueList, useRemoveOpenIssueBatch, useUpdateOpenIssue } from 'api/qms/open-issue/useOpenIssueService';
import { commonNotification } from 'api/common/notification';
import { handleServerError } from 'utils/error';
import { confirmation } from 'components/confirm/CommonConfirm';
import { useIntl } from 'react-intl';
import { useGridStateStore } from 'store/gridState.store';
import useConfig from 'hooks/useConfig';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { mutationOptions, queryKeys } from 'api/qms/open-issue/openIssue.query';
import dayjs from 'dayjs';
import IssueCommentDrawer, { IssueCommentDrawerRef } from 'components/drawer/IssueCommentDrawer';
import useAuth from 'hooks/useAuth';
import { calculateDelay, checkIssueUser } from '../util';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import fileService from 'api/file/fileService';
import { fileQueryOptions } from 'api/file/file.query';
import { CommonFile } from 'api/file/file.types';
import ExcelUploadDialog from 'dialogs/ExcelUploadDialog';
import useLibrary from 'hooks/useLibrary';
import FileUploadDrawer, { FileUploadDrawerRef } from 'components/drawer/FileUploadDrawer';
import QuickFilterChips from 'components/grid/QuickFilterChips';
import KanbanBoard from './KanbanBoard';
import MeetingSummaryDrawer, { MeetingSummaryDrawerRef } from 'components/drawer/MeetingSummaryDrawer';

const TooltipContent = ({ label }: { label: string }) => {
  return (
    <>
      <Box display={'flex'} alignItems={'center'}>
        <Box
          sx={{
            width: 12,
            height: 12,
            bgcolor: 'gold',
            display: 'inline-block'
          }}
        />
        <span> : {label}</span>
      </Box>
    </>
  );
};

const templatePath = '/templates/openissue_template.xlsx';

const Toolbar = withSimpleSearchForm<any, { loadingState: Record<string, boolean> }>(({ btnActions, formikProps, loadingState }) => {
  const { formatMessage } = useIntl();
  const { i18n } = useConfig();

  return (
    <>
      <TextField
        name="searchWord"
        placeholder={formatMessage({ id: 'placeholder-search' })}
        value={formikProps.values.searchWord ?? ''}
        onChange={formikProps.handleChange}
        size="small"
      />
      <CommonButton
        title="reset"
        variant="standard"
        icon={<FontAwesomeIcon icon={faRotateBackward} />}
        onClick={btnActions.reset}
        icononly="true"
        size="small"
      />
      <CommonButton
        title={formatMessage({ id: 'btn-search' })}
        variant="standard"
        icon={<FontAwesomeIcon icon={faSearch} />}
        onClick={() => {
          formikProps.submitForm();
        }}
        icononly="true"
        size="small"
      />
      <CommonButton
        title={formatMessage({ id: 'btn-excel-upload' })}
        variant="outlined"
        icon={<FontAwesomeIcon icon={faCloudUpload} />}
        onClick={btnActions.excelUpload}
        size="small"
      />
      <CommonButton
        title={formatMessage({ id: 'btn-template-download' })}
        variant="outlined"
        icon={<FontAwesomeIcon icon={faPaperclip} />}
        onClick={btnActions.templateDownload}
        size="small"
      />
      <CommonButton
        title={formatMessage({ id: 'btn-download' })}
        variant="outlined"
        onClick={() => btnActions.download()}
        icon={<FontAwesomeIcon icon={faDownload} />}
        size="small"
      />
      <CommonButton
        title={formatMessage({ id: 'btn-newIssue' })}
        variant="outlined"
        onClick={() => btnActions.add()}
        icon={<FontAwesomeIcon icon={faPlus} />}
        size="small"
      />
      <CommonButton
        title={formatMessage({ id: 'btn-delete' })}
        variant="outlined"
        color="error"
        onClick={() => btnActions.delete()}
        icon={<FontAwesomeIcon icon={faTrashCan} />}
        size="small"
      />
      <CommonButton
        title={formatMessage({ id: 'btn-save' })}
        variant="contained"
        onClick={() => btnActions.save()}
        icon={<FontAwesomeIcon icon={faSave} />}
        disabled={i18n !== 'ko'} // TODO : 제거 필요
        size="small"
        loading={loadingState.saveLoading}
      />
    </>
  );
});

type ViewMode = 'grid' | 'kanban';

const DeptTable = ({
  selectedGroup,
  selectedTeam,
  selectedPlace,
  currentIssueGroupNm
}: {
  selectedGroup: string;
  selectedTeam: string;
  selectedPlace: string;
  currentIssueGroupNm?: string;
}) => {
  const [rowData, setRowData] = useState<OpenIssueType[]>([]);
  // const [isInit, setIsInit] = useState(true);
  const [searchParam, setSearchParam] = useState<any>();
  const [targetIssue, setTargetIssue] = useState<OpenIssueType>();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const gridId = `deptOIL-${selectedTeam}`;

  const queryClient = useQueryClient();
  const { librarySelect } = useLibrary();

  const groupGridRef = useRef<AgGridReact<OpenIssueType>>(null);
  const toolbarRef = useRef<FormikProps<any>>(null);
  const issueCommentDrawerRef = useRef<IssueCommentDrawerRef>(null);
  const fileUploadDrawerRef = useRef<FileUploadDrawerRef>(null);
  const meetingSummaryDrawerRef = useRef<MeetingSummaryDrawerRef>(null);
  const { BasicDialog: ExcelUploadDialogBase, handleClose: closeExcelUploadDialog, handleOpen: openExcelUploadDialog } = useBasicDialog();

  const { formatMessage } = useIntl();
  const { updateState, state } = useGridStateStore();
  const { user } = useAuth();

  const { onUpdateCells, addRow, getUpdatedRows, exportToExcel, getSelectedRows, removeRowNode } = useEditGrid(groupGridRef);
  const { deptOILColumns } = useColumns({
    selectedGroup: Number(selectedGroup),
    deptOption: {
      openFileUploader: (data: OpenIssueType) => {
        setTargetIssue(data);
        fileUploadDrawerRef.current?.open();
      },
      onFileClick: (data: OpenIssueType) => {
        setTargetIssue(data);
        fileUploadDrawerRef.current?.open();
      },
      onCommentClick: (data: OpenIssueType) => {
        setTargetIssue(data);
        issueCommentDrawerRef.current?.open();
      }
    }
  });

  const { data, refetch, isFetching } = useOpenIssueList({
    openIssueType: selectedPlace,
    openIssueGroup: Number(selectedTeam),
    openIssueCategoryOid: selectedGroup ? Number(selectedGroup) : undefined,
    searchWord: searchParam?.searchWord ?? ''
  });

  // const { data, refetch, isFetching } = useQuery({
  //   queryKey: ['openIssue', 'list', selectedGroup, selectedTeam, selectedPlace, searchParam?.searchWord],
  //   queryFn: () =>
  //     openIssueService.searchOpenIssue({
  //       openIssueType: selectedPlace,
  //       openIssueGroup: Number(selectedTeam),
  //       openIssueCategoryOid: selectedGroup ? Number(selectedGroup) : undefined,
  //       searchWord: searchParam?.searchWord ?? ''
  //     }),
  //   enabled: !!selectedGroup && !!selectedTeam && !!selectedPlace
  // });

  const { data: currentFileList, refetch: refetchFileList } = useQuery({
    ...fileQueryOptions.selectFileList({ oid: targetIssue?.oid ?? -1 }),
    enabled: !!targetIssue?.oid
  });

  const { mutate: updateOpenIssue, isPending } = useUpdateOpenIssue();
  const { mutate: removeOpenIssueBatch } = useRemoveOpenIssueBatch();
  const { mutate: uploadFile } = useMutation({
    mutationFn: (payload: { oid: number; files: File[] }) => fileService.uploadFile(payload.oid, payload.files)
  });
  const { mutate: deleteFile } = useMutation({
    mutationFn: (fileOid: number) => fileService.deleteFile(fileOid)
  });
  const { mutate: insOpenIssueV2 } = useMutation(mutationOptions.insOpenIssueV2());

  const updateGridState = (): void => {
    if (!groupGridRef.current || !groupGridRef.current.api) return;

    updateState(groupGridRef.current.api, gridId);
  };

  const handleAddIssue = () => {
    if (!groupGridRef.current?.api) return;
    if (!selectedGroup || selectedGroup.length < 1) {
      commonNotification.warn(formatMessage({ id: 'msg-select-group' }));
      return;
    }
    // const rowCnt = getAllRows(groupGridRef.current.api).length;
    addRow(
      { ...initOpenIssue, openIssueType: 'DEPT', openIssueCategoryOid: Number(selectedGroup), openIssueGroup: Number(selectedTeam) },
      false
    );
  };

  const handleSaveIssue = () => {
    updateGridState();
    if (!selectedGroup || selectedGroup.length < 1) {
      commonNotification.warn(formatMessage({ id: 'msg-select-group' }));
      return;
    }
    if (getUpdatedRows().length < 1) {
      commonNotification.warn(formatMessage({ id: 'msg-no-modified-data' }));
      return;
    }
    updateOpenIssue(
      getUpdatedRows().map((el) => {
        return {
          ...el,
          replaceMembers: el.predecessors?.join(','),
          delayDt: calculateDelay(el)
        };
      }),
      {
        onSuccess: () => {
          commonNotification.success(formatMessage({ id: 'msg-saved' }));
          queryClient.invalidateQueries({ queryKey: queryKeys.openIssueMenu(selectedPlace) });
          refetch().then(() => {
            groupGridRef.current?.api.refreshClientSideRowModel();
          });
        },
        onError: (error) => handleServerError(error)
      }
    );
  };

  const handleDeleteIssue = async () => {
    const selectedRows = getSelectedRows();
    if (selectedRows.length < 1) {
      commonNotification.warn(formatMessage({ id: 'msg-select-issue-delete' }));
      return;
    }

    const isAuth = selectedRows.every((el) => checkIssueUser(user, el));
    if (!isAuth) {
      commonNotification.error(formatMessage({ id: 'msg-only-my-issue-delete' }));
      return;
    }

    const result = await confirmation({
      title: formatMessage({ id: 'dialog-issue-delete' }),
      msg: formatMessage({ id: 'dialog-confirm-issue-delete' })
    });
    if (!result) return;

    const newNodes: IRowNode<OpenIssueType>[] = [];
    const existRows = selectedRows.filter((el) => !el.isNew);

    groupGridRef.current?.api.forEachNode((node) => {
      if (node?.data?.isNew && node.isSelected()) {
        newNodes.push(node);
      }
    });

    newNodes.forEach((node) => {
      removeRowNode(node);
    });

    if (existRows.length > 0) {
      removeOpenIssueBatch(existRows, {
        onSuccess: () => {
          commonNotification.success(formatMessage({ id: 'msg-deleted' }));
          refetch();
        },
        onError: (error) => handleServerError(error)
      });
    }
  };

  const handleExcelUpload = () => {
    if (!selectedGroup || selectedGroup.length < 1) {
      commonNotification.warn(formatMessage({ id: 'msg-select-group' }));
      return;
    }
    openExcelUploadDialog();
  };

  const handleTemplateDownload = () => {
    const link = document.createElement('a');
    link.href = templatePath;
    link.download = '오픈이슈_등록_템플릿.xlsx';
    link.click();
  };

  const btnActions = {
    add: handleAddIssue,
    save: handleSaveIssue,
    download: () => {
      exportToExcel({ title: `Open Issue 현황_${dayjs().format('YYYY-MM-DD_HHmmss')}`, objectMap: { openIssueManager: 'personNm' } });
    },
    reset: () => {
      setSearchParam(undefined);
      toolbarRef.current?.resetForm({ values: {} });
    },
    delete: handleDeleteIssue,
    excelUpload: handleExcelUpload,
    templateDownload: handleTemplateDownload
  };

  const getRowClass = useCallback(({ data }: RowClassParams) => {
    if (!data) return undefined;

    const classes: string[] = [];

    // 완료된 이슈: 비활성화 스타일
    if (data.issueState?.toString() === '78106') {
      classes.push('completed-row');
    }

    // 지연된 이슈: 빨간 배경 강조
    const delay = calculateDelay(data);
    if (delay && delay > 0) {
      classes.push('delayed-row');
    }

    // 긴급 이슈 (importance = 5): 좌측 빨간 보더
    if (data.importance === '5') {
      classes.push('urgent-row');
    }

    // 지시사항 (importance = 4): 좌측 보라 보더
    if (data.importance === '4') {
      classes.push('instruction-row');
    }

    return classes.join(' ');
  }, []);

  const rowSelection = useMemo<RowSelectionOptions>(
    () => ({
      mode: 'multiRow',
      checkbox: true
    }),
    []
  );

  const getContextMenuItems = ({ node }: GetContextMenuItemsParams) => {
    if (!node) return [];
    return [
      {
        name: formatMessage({ id: 'label-comment-regist' }),
        action: () => {
          issueCommentDrawerRef.current?.open();
        }
      }
    ];
  };

  const handleFileUpload = (files: File[]) => {
    if (!targetIssue) return;
    uploadFile(
      { oid: targetIssue.oid, files },
      {
        onSuccess: () => {
          commonNotification.success(formatMessage({ id: 'msg-uploaded' }));
          refetch();
          refetchFileList();
        },
        onError: (error) => handleServerError(error)
      }
    );
  };

  const handleExcelFileUpload = (data: OpenIssueType[]) => {
    // library 후처리
    const processed = data.map((el) => {
      const placeOfIssue = librarySelect?.placeOfIssue.find((item) => item.label === el.placeOfIssue);
      const productionSite = librarySelect?.productionSite.find((item) => item.label === el.productionSite);
      const issueType = librarySelect?.issueType.find((item) => item.label === el.issueType);
      const management = ['Y', 'N'].find((item) => item === el.management);
      const importance = importanceList.find((item) => item.label === el.importance);

      el.openIssueType = 'DEPT';
      el.openIssueCategoryOid = Number(selectedGroup);
      el.openIssueGroup = Number(selectedTeam);

      if (placeOfIssue) {
        el.placeOfIssue = placeOfIssue.value;
      } else {
        el.placeOfIssue = '';
      }
      if (productionSite) {
        el.productionSite = productionSite.value;
      } else {
        el.productionSite = '';
      }
      if (issueType) {
        el.issueType = issueType.value;
      } else {
        el.issueType = '';
      }
      if (management) {
        el.management = management === 'Y' ? 'true' : 'false';
      } else {
        el.management = '';
      }
      if (importance) {
        el.importance = importance.value;
      } else {
        el.importance = '';
      }
      return el;
    });

    // api 호출
    insOpenIssueV2(processed, {
      onSuccess: () => {
        commonNotification.success(formatMessage({ id: 'msg-saved' }));
        refetch();
      },
      onError: handleServerError
    });
  };

  const handleFileDelete = async (file: CommonFile) => {
    const result = await confirmation({
      title: formatMessage({ id: 'dialog-file-delete' }),
      msg: formatMessage({ id: 'dialog-confirm-file-delete' })
    });
    if (!result) return;

    deleteFile(file.fileOid, {
      onSuccess: () => {
        commonNotification.success(formatMessage({ id: 'msg-deleted' }));
        refetchFileList();
      },
      onError: (error) => handleServerError(error)
    });
  };

  // 1) 외부 필터 활성 여부
  // const isExternalFilterPresent = useCallback(() => {
  //   return isInit;
  // }, [isInit]);

  // 2) 외부 필터 조건 충족 여부
  // const doesExternalFilterPass = useCallback(
  //   (node: any) => {
  //     if (!isInit) return true;
  //     return node.data.createUs === user?.userUid;
  //   },
  //   [isInit, user]
  // );

  // useEffect(() => {
  //   if (!groupGridRef.current?.api) return;
  //   groupGridRef.current?.api.onFilterChanged();
  // }, [isInit]);

  useEffect(() => {
    if (!selectedGroup && !selectedTeam) return;
    if (data) {
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

  const IssueDrawerActions = () => {
    return (
      <Tooltip title={formatMessage({ id: 'label-file' })}>
        <IconButton
          onClick={() => {
            issueCommentDrawerRef.current?.close();
            fileUploadDrawerRef.current?.open();
          }}
          size="small"
        >
          <FontAwesomeIcon icon={faUpload} />
        </IconButton>
      </Tooltip>
    );
  };

  const UploadDrawerActions = () => {
    return (
      <Tooltip title={formatMessage({ id: 'label-comment' })}>
        <IconButton
          onClick={() => {
            fileUploadDrawerRef.current?.close();
            issueCommentDrawerRef.current?.open();
          }}
          size="small"
        >
          <FontAwesomeIcon icon={faPen} />
        </IconButton>
      </Tooltip>
    );
  };

  const handleKanbanCardClick = (issue: OpenIssueType) => {
    setTargetIssue(issue);
    issueCommentDrawerRef.current?.open();
  };

  return (
    <Box p={1} pb={0} display={'flex'} flexDirection={'column'} flex={'0 1 85vw'}>
      <Box display="flex" alignItems="center" gap={1}>
        <Box flex={1}>
          <Toolbar
            title={formatMessage({ id: 'deptOILTitle' })}
            description={currentIssueGroupNm}
            tooltip={<TooltipContent />}
            ref={toolbarRef}
            btnActions={btnActions}
            onSubmit={(values) => {
              setSearchParam(values);
            }}
            initialValues={{}}
            direction="end"
            loadingState={{
              saveLoading: isPending
            }}
          />
        </Box>
        <Tooltip title={formatMessage({ id: 'meeting-summary-title' })}>
          <IconButton size="small" onClick={() => meetingSummaryDrawerRef.current?.open()} sx={{ height: 32, width: 32 }}>
            <FileText size={16} />
          </IconButton>
        </Tooltip>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, val) => val && setViewMode(val)}
          size="small"
          sx={{ height: 32 }}
        >
          <ToggleButton value="grid" aria-label="grid view">
            <LayoutList size={16} />
          </ToggleButton>
          <ToggleButton value="kanban" aria-label="kanban view">
            <LayoutGrid size={16} />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'grid' ? (
        <>
          {/* Smartsheet 스타일 Quick Filter */}
          <QuickFilterChips gridRef={groupGridRef} userId={user?.oid} />
          <CommonGrid
            ref={groupGridRef}
            gridProps={{
              columnDefs: deptOILColumns,
              rowData: rowData,
              onCellValueChanged: onUpdateCells,
              pagination: true,
              paginationPageSize: 50,
              paginationPageSizeSelector: [10, 20, 50, 100],
              loading: isFetching,
              getRowClass: getRowClass,
              getRowHeight: ({ data }) => {
                const lines = (data?.description?.match(/\n/g) || []).length + 1;
                if (lines > 1 && lines <= 5) return lines * 25;
                else if (lines > 5) return 5 * 24;
                return 28;
              },
              getContextMenuItems: getContextMenuItems,
              onCellContextMenu: ({ node }) => {
                setTargetIssue(node.data);
              },
              rowSelection,
              context: {
                id: gridId
              }
            }}
            autoSizeMode={'fullWidth'}
          />
        </>
      ) : (
        <KanbanBoard
          issues={rowData}
          onCardClick={handleKanbanCardClick}
          refetch={() => refetch()}
        />
      )}

      <IssueCommentDrawer ref={issueCommentDrawerRef} issue={targetIssue} refetchIssues={refetch} Actions={IssueDrawerActions} />
      <FileUploadDrawer
        ref={fileUploadDrawerRef}
        files={currentFileList || []}
        onUpload={handleFileUpload}
        onFileDelete={handleFileDelete}
        Actions={UploadDrawerActions}
      />
      <ExcelUploadDialog
        BasicDialog={ExcelUploadDialogBase}
        handleClose={closeExcelUploadDialog}
        onUpload={handleExcelFileUpload}
        keys={[
          'placeOfIssue',
          'productionSite',
          'deptCustomerNm',
          'issueType',
          'deptProjectNm',
          'deptItemNm',
          'contents',
          'description',
          'management',
          'importance',
          'assignedTo',
          'strDt',
          'finDt',
          'sop',
          'volum',
          'salesYear'
        ]}
        columnDefs={deptOILColumns}
        initRow={initOpenIssue}
      />
      <MeetingSummaryDrawer
        ref={meetingSummaryDrawerRef}
        issues={rowData}
        groupName={currentIssueGroupNm}
      />
    </Box>
  );
};

export default DeptTable;
