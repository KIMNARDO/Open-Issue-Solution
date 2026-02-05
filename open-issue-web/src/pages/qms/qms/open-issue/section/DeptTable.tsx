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
import { Box, IconButton, TextField, Tooltip } from '@mui/material';
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

const TooltipContent = () => {
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
        <span> : 필수입력</span>
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
        title="검색"
        variant="standard"
        icon={<FontAwesomeIcon icon={faSearch} />}
        onClick={() => {
          formikProps.submitForm();
        }}
        icononly="true"
        size="small"
      />
      <CommonButton
        title="엑셀업로드"
        variant="outlined"
        icon={<FontAwesomeIcon icon={faCloudUpload} />}
        onClick={btnActions.excelUpload}
        size="small"
      />
      <CommonButton
        title="템플릿 다운로드"
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
  const gridId = `deptOIL-${selectedTeam}`;

  const queryClient = useQueryClient();
  const { librarySelect } = useLibrary();

  const groupGridRef = useRef<AgGridReact<OpenIssueType>>(null);
  const toolbarRef = useRef<FormikProps<any>>(null);
  const issueCommentDrawerRef = useRef<IssueCommentDrawerRef>(null);
  const fileUploadDrawerRef = useRef<FileUploadDrawerRef>(null);
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
      commonNotification.warn('그룹을 선택해주세요.');
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
      commonNotification.warn('그룹을 선택해주세요.');
      return;
    }
    if (getUpdatedRows().length < 1) {
      commonNotification.warn('수정된 데이터가 없습니다.');
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
          commonNotification.success('저장되었습니다');
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
      commonNotification.warn('삭제할 이슈를 선택해주세요.');
      return;
    }

    const isAuth = selectedRows.every((el) => checkIssueUser(user, el));
    if (!isAuth) {
      commonNotification.error('내가 작성한 이슈만 삭제할 수 있습니다.');
      return;
    }

    const result = await confirmation({
      title: '이슈 삭제',
      msg: '선택한 이슈를 삭제하시겠습니까?'
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
          commonNotification.success('삭제되었습니다');
          refetch();
        },
        onError: (error) => handleServerError(error)
      });
    }
  };

  const handleExcelUpload = () => {
    if (!selectedGroup || selectedGroup.length < 1) {
      commonNotification.warn('그룹을 선택해주세요.');
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
    if (!data || !data.issueState) return undefined;
    return data.issueState.toString() === '78106' ? 'disabled-row' : '';
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
        name: '의견 등록',
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
          commonNotification.success('업로드되었습니다');
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
        commonNotification.success('저장되었습니다');
        refetch();
      },
      onError: handleServerError
    });
  };

  const handleFileDelete = async (file: CommonFile) => {
    const result = await confirmation({
      title: '파일 삭제',
      msg: '선택한 파일을 삭제하시겠습니까?'
    });
    if (!result) return;

    deleteFile(file.fileOid, {
      onSuccess: () => {
        commonNotification.success('삭제되었습니다');
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
      <Tooltip title="파일">
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
      <Tooltip title="의견">
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

  return (
    <Box p={1} pb={0} display={'flex'} flexDirection={'column'} flex={'0 1 85vw'}>
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
          // onCellEditingStarted: ({ event, node, api }) => {
          //   const cell = (event?.target as any)?.closest('.ag-cell');

          //   if (!cell) return;

          //   const textarea = cell.querySelector('textarea');
          //   if (!textarea) return;

          //   // textarea 높이 계산
          //   // textarea.style.height = 'auto';
          //   // textarea.style.height = `${textarea.scrollHeight}px`;

          //   const newHeight = textarea.scrollHeight + 18;

          //   node.setRowHeight(newHeight);
          //   api.onRowHeightChanged();
          // },
          // onCellEditingStopped: ({ node, api }) => {
          //   api.resetRowHeights();
          // },
          getContextMenuItems: getContextMenuItems,
          onCellContextMenu: ({ node }) => {
            setTargetIssue(node.data);
          },
          rowSelection,
          context: {
            id: gridId
          }
          // isExternalFilterPresent,
          // doesExternalFilterPass
        }}
        autoSizeMode={'fullWidth'}
      />
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
    </Box>
  );
};

export default DeptTable;
