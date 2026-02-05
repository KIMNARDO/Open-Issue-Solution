import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';

const useColumns = () => {
  const pjtColumns: (ExColDef | ExColGroupDef)[] = [
    { field: 'name', headerName: '프로젝트명' },
    { field: 'productNm', headerName: '제품명' },
    { field: 'projectType', headerName: '프로젝트유형' }
  ];

  const salesOrderColumns: (ExColDef | ExColGroupDef)[] = [
    { field: 'name', headerName: 'ERP 관리번호' },
    { field: 'pgmNm', headerName: '프로그램' },
    { field: 'itemTypeNm', headerName: '제품군' },
    { field: 'customerNm', headerName: '고객사' },
    { field: 'statusNm', headerName: '상태' }
  ];

  return {
    pjtColumns,
    salesOrderColumns
  };
};

export default useColumns;
