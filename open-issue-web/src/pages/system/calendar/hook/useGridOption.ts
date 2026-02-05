import { RowClickedEvent, RowSelectionOptions } from 'ag-grid-community';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import { useCallback, useMemo } from 'react';

const useGridOption = () => {
  const rowSelection = useMemo<RowSelectionOptions>(() => {
    return {
      mode: 'singleRow',
      checkboxes: true
    };
  }, []);

  const onRowClicked = useCallback(({ node }: RowClickedEvent) => {
    node.setSelected(node.isSelected() ? false : true);
  }, []);

  const colDef = useMemo<(ExColDef | ExColGroupDef)[]>(() => {
    return [
      { field: 'title', headerName: '일정명', width: 150 },
      { field: 'contents', headerName: '내용', width: 150 }
    ];
  }, []);

  return {
    rowSelection,
    onRowClicked,
    colDef
  };
};

export default useGridOption;
