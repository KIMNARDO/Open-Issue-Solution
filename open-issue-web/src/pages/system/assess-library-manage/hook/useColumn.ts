import { ColDef } from 'ag-grid-community';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import DirectSwitchRenderer from 'components/cellEditor/DirectSwitch';
import { emptyValueFormatter } from 'components/grid/valueformatter';

export const useAssessLibraryColumn = (): ColDef[] => {
  const libColumn: (ExColDef | ExColGroupDef)[] = [
    {
      field: 'id',
      headerName: 'NO',
      editable: false,
      hide: true
    },
    {
      field: 'name',
      headerName: '이름',
      editable: false,
      cellStyle: { textAlign: 'left' },
      headerClass: 'required'
    },
    {
      field: 'ord',
      headerName: '순서',
      editable: false,
      valueParser: ({ newValue }) => Number(newValue)
    },
    {
      field: 'description',
      headerName: '설명',
      editable: false
    },
    {
      field: 'fromOID',
      headerName: '상위코드',
      editable: false,
      valueFormatter: emptyValueFormatter
    },
    {
      field: 'useYn',
      headerName: '사용여부',
      cellRenderer: DirectSwitchRenderer,
      editable: false
    }
  ];

  return libColumn;
};
