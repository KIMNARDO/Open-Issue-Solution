import { Box } from '@mui/material';
import Toolbar from './section/Toolbar';
import CommonGrid from 'components/grid/CommonGrid';
import { AssessmentLibrary, LibrarySearch } from 'api/system/library/library.types';
import { FormikProps } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditGrid } from 'components/grid/useEditGrid';
import { AgGridReact } from 'ag-grid-react';
import { commonNotification } from 'api/common/notification';
import { useQuery } from '@tanstack/react-query';
import { libAssessQueryOptions } from 'api/system/library/library.query';
import { CellDoubleClickedEvent, GetContextMenuItems } from 'ag-grid-community';
import { useAssessLibraryColumn } from './hook/useColumn';
import BasicLayout from 'layout/Basic';
import AssessLibDetailDialog from '../dialog/library/AssessLibDetailDialog';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';

const initParam: LibrarySearch = {};

const AssessLibraryManage = () => {
  const toolbarRef = useRef<FormikProps<LibrarySearch>>(null);
  const gridRef = useRef<AgGridReact<any>>(null);

  const [libData, setLibData] = useState<AssessmentLibrary[]>([]);
  const [, setSearchParam] = useState<LibrarySearch>(initParam);
  const [, setTargetCode] = useState<AssessmentLibrary>();
  const [mode, setMode] = useState<'add' | 'edit'>('add');

  const assessLibDetailDialogRef = useRef<BasicDialogRef>(null);

  const { getUpdatedRows, onUpdateCells } = useEditGrid(gridRef);

  const { data } = useQuery(libAssessQueryOptions.selectAssessmentList());

  const columns = useAssessLibraryColumn();

  const btnActions = {
    saveLibrary: () => {
      const updatedRows = getUpdatedRows();
      if (updatedRows.length < 1) {
        commonNotification.warn('수정된 데이터가 없습니다');
        return;
      }
    },
    addLibrary: () => {
      setMode('add');
      setTargetCode(undefined);
      assessLibDetailDialogRef.current?.open();
    }
  };

  const onCellDoubleClicked = useCallback(({ data, colDef }: CellDoubleClickedEvent) => {
    if (colDef.field === 'oid') {
      return;
    }
    setTargetCode(data);
    setMode('edit');
    assessLibDetailDialogRef.current?.open();
  }, []);

  const getContextMenuItems: GetContextMenuItems = useCallback(({ node }) => {
    return [
      {
        name: '라이브러리 추가',
        action: () => {
          setMode('add');
          setTargetCode(node?.data);
          assessLibDetailDialogRef.current?.open();
        }
      }
    ];
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
            treeDataChildrenField: 'cData',
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
      <AssessLibDetailDialog ref={assessLibDetailDialogRef} mode={mode} onSubmit={() => {}} />
    </BasicLayout>
  );
};

export default AssessLibraryManage;
