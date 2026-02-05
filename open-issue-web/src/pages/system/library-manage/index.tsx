import { Box } from '@mui/material';
import Toolbar from './section/Toolbar';
import CommonGrid from 'components/grid/CommonGrid';
import { useLibraryColumn } from './hook/useColumn';
import { DLibrary, Library, LibrarySearch } from 'api/system/library/library.types';
import { FormikProps } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditGrid } from 'components/grid/useEditGrid';
import { AgGridReact } from 'ag-grid-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { libraryQueryOptions } from 'api/system/library/library.query';
import LibDetailDialog from '../dialog/library/LibDetailDialog';
import { CellDoubleClickedEvent, GetContextMenuItems, MenuItemDef } from 'ag-grid-community';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';
import BasicLayout from 'layout/Basic';
import { confirmation } from 'components/confirm/CommonConfirm';
import libraryService from 'api/system/library/libraryService';
import { commonNotification } from 'api/common/notification';
import { handleServerError } from 'utils/error';

const initParam: LibrarySearch = {};

const LibraryManage = () => {
  const toolbarRef = useRef<FormikProps<LibrarySearch>>(null);
  const libDetailDialogRef = useRef<BasicDialogRef>(null);

  const gridRef = useRef<AgGridReact<Library>>(null);
  const [libData, setLibData] = useState<DLibrary[]>([]);
  const [, setSearchParam] = useState<LibrarySearch>(initParam);
  const [targetCode, setTargetCode] = useState<DLibrary>();
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  const { data, refetch } = useQuery(libraryQueryOptions.selectLibraryList());

  const { mutate: deleteLibrary } = useMutation({ mutationFn: (payload: DLibrary) => libraryService.deleteLibrary(payload) });

  const { onUpdateCells } = useEditGrid(gridRef);

  const columns = useLibraryColumn();

  const btnActions = {
    saveLibrary: () => {}
  };

  const onCellDoubleClicked = useCallback(({ data, colDef }: CellDoubleClickedEvent) => {
    if (colDef.field === 'oid') {
      return;
    }
    setTargetCode(data);
    setMode('edit');
    libDetailDialogRef.current?.open();
  }, []);

  const getContextMenuItems: GetContextMenuItems = useCallback(({ node }) => {
    const menus: MenuItemDef[] = [
      {
        name: '라이브러리 추가',
        action: () => {
          setMode('add');
          setTargetCode(node?.data);
          libDetailDialogRef.current?.open();
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
          deleteLibrary(node?.data, {
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
      <LibDetailDialog ref={libDetailDialogRef} mode={mode} current={targetCode} onSubmit={() => refetch()} />
    </BasicLayout>
  );
};

export default LibraryManage;
