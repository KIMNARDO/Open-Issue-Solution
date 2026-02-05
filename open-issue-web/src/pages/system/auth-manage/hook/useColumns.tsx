import DirectCheckboxRenderer from 'components/cellEditor/DirectCheckbox';
import { ExColDef, ExColGroupDef } from 'components/grid/grid.types';
import { useMemo } from 'react';

export const useModuleColumns = () => {
  const columns = useMemo<(ExColDef | ExColGroupDef)[]>(
    () => [
      {
        field: 'module',
        headerName: '모듈',
        maxWidth: 1000
      }
    ],
    []
  );
  return columns;
};

export const useRoleColumns = () => {
  const columns = useMemo<(ExColDef | ExColGroupDef)[]>(
    () => [
      {
        field: 'role',
        headerName: '역할'
      },
      {
        field: 'view',
        headerName: '조회',
        cellRenderer: DirectCheckboxRenderer,
        context: { checkboxOption: { valueType: 'YN' } }
      },
      {
        field: 'edit',
        headerName: '수정',
        cellRenderer: DirectCheckboxRenderer,
        context: { checkboxOption: { valueType: 'YN' } }
      },
      {
        field: 'delete',
        headerName: '삭제',
        cellRenderer: DirectCheckboxRenderer,
        context: { checkboxOption: { valueType: 'YN' } }
      }
    ],
    []
  );
  return columns;
};
