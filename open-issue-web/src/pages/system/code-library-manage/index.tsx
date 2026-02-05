import { Box } from '@mui/material';
import Toolbar from './section/Toolbar';
import CommonGrid from 'components/grid/CommonGrid';
import { useCodeLibraryColumn } from './hook/useColumn';
import { CodeLibrary, Library, LibrarySearch } from 'api/system/library/library.types';
import { FormikProps } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditGrid } from 'components/grid/useEditGrid';
import { AgGridReact } from 'ag-grid-react';
import { commonNotification } from 'api/common/notification';
import { useMutation, useQuery } from '@tanstack/react-query';
import { codeLibQueryOptions } from 'api/system/library/library.query';
import CodeLibDetailDialog from '../dialog/library/CodeLibDetailDialog';
import { CellDoubleClickedEvent, GetContextMenuItems, MenuItemDef } from 'ag-grid-community';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';
import BasicLayout from 'layout/Basic';
import libraryService from 'api/system/library/libraryService';
import { confirmation } from 'components/confirm/CommonConfirm';
import { handleServerError } from 'utils/error';

const initParam: LibrarySearch = {};

const LibraryManage = () => {
  const toolbarRef = useRef<FormikProps<LibrarySearch>>(null);
  const gridRef = useRef<AgGridReact<Library>>(null);
  const codeLibDetailDialogRef = useRef<BasicDialogRef>(null);

  const [libData, setLibData] = useState<CodeLibrary[]>([]);
  const [, setSearchParam] = useState<LibrarySearch>(initParam);
  const [targetCode, setTargetCode] = useState<CodeLibrary>();
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  const { getUpdatedRows, onUpdateCells } = useEditGrid(gridRef);

  const columns = useCodeLibraryColumn();

  const { data, refetch } = useQuery(codeLibQueryOptions.selectAllCodeLibrary());

  const { mutate: deleteCodeLibrary } = useMutation({ mutationFn: (payload: CodeLibrary) => libraryService.deleteCodeLibrary(payload) });

  const btnActions = {
    saveLibrary: () => {
      const updatedRows = getUpdatedRows();
      if (updatedRows.length < 1) {
        commonNotification.warn('수정된 데이터가 없습니다');
        return;
      }
    }
  };

  const onCellDoubleClicked = useCallback(({ data, colDef }: CellDoubleClickedEvent) => {
    if (colDef.field === 'oid') {
      return;
    }
    setTargetCode(data);
    setMode('edit');
    codeLibDetailDialogRef.current?.open();
  }, []);

  const getContextMenuItems: GetContextMenuItems = useCallback(({ node }) => {
    const menus: MenuItemDef[] = [
      {
        name: '라이브러리 추가',
        action: () => {
          setMode('add');
          setTargetCode(node?.data);
          codeLibDetailDialogRef.current?.open();
        }
      }
    ];

    if (node?.data) {
      menus.push({
        name: '라이브러리 삭제',
        action: async () => {
          // confirmation
          const result = await confirmation({
            title: '삭제',
            msg: '삭제하시겠습니까?'
          });
          if (!result) return;
          deleteCodeLibrary(node?.data, {
            onSuccess: () => {
              commonNotification.success('삭제되었습니다');
              refetch();
            },
            onError: (error) => handleServerError(error)
          });
        }
      });
    }

    return menus;
  }, []);

  useEffect(() => {
    if (data) {
      setLibData(data);
    }
  }, [data]);

  return (
    <BasicLayout>
      <Toolbar
        ref={toolbarRef}
        btnActions={btnActions}
        onSubmit={(values) => {
          setSearchParam(values);
        }}
        initialValues={initParam}
        direction="end"
      />
      <Box sx={{ height: 'calc(100% - 36px)', pb: 1 }}>
        <CommonGrid
          ref={gridRef}
          gridProps={{
            columnDefs: columns,
            rowData: libData,
            autoGroupColumnDef: {
              field: 'oid',
              headerName: '코드',
              headerClass: 'required'
            },
            treeData: true,
            treeDataParentIdField: 'fromOID',
            getRowId: ({ data }) => data.oid,
            // getDataPath: (data) => data.path,
            excludeChildrenWhenTreeDataFiltering: true,
            onCellContextMenu: ({ node }) => {
              node.setSelected(true);
            },
            onCellValueChanged: onUpdateCells,
            rowSelection: { mode: 'singleRow', checkboxes: false },
            onRowClicked: ({ node }) => {
              if (node.isSelected()) {
                node.setSelected(false);
              } else {
                node.setSelected(true);
              }
            },
            onCellDoubleClicked,
            getContextMenuItems
          }}
        />
      </Box>
      <CodeLibDetailDialog ref={codeLibDetailDialogRef} mode={mode} current={targetCode} onSubmit={() => refetch()} />
    </BasicLayout>
  );
};

export default LibraryManage;
