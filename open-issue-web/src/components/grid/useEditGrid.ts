import { CellValueChangedEvent, ColDef, IRowNode, RowNodeTransaction } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { RefObject, useCallback, useState } from 'react';
import { v4 } from 'uuid';
import { ObjectSchema, ValidationError } from 'yup';
import { SelectboxType } from 'components/select/selectbox.types';
import { GridSelectFormatter, GridSelectRenderer } from 'components/cellEditor/SelectEditor';

export interface GridHookProps {
  id?: string;
  isNew?: boolean;
  isUpdated?: boolean;
  rowIndex?: number;
  isError?: boolean;
  errorField?: string[];
}

export interface PrintGridOptions {
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  margins?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  title?: string;
  headerCount?: number;
  headerColor?: string;
}

/**
 *
 * @param gridRef 그리드 ref 객체
 * @param schema 유효성 검사를 위한 yup schema
 * @returns 편집 그리드를 생성하기 위해 필요한 요소
 * @description
 *  - addRow: 행을 추가하는 함수
 *  - removeSelectedRows: 행을 삭제하는 함수
 *  - reset: 테이블을 초기화하는 함수
 *  - onUpdateCells: 테이블에 수정된 데이터를 저장하는 함수 ( grid의 onCellValueChanged 이벤트에 적용 )
 *  - getUpdatedRows: 수정된 행
 *  - resetTrigger: 테이블 초기화를 위한 state (grid의 key에 사용)
 *  - getSelectedRows: 선택된 행을 반환하는 함수
 *  - getErrorRows: 오류가 있는 행을 반환하는 함수
 * @example
 * const gridRef = useRef<AgGridReact<any>>(null);
 * const { addRow, onUpdateCells, resetTrigger, reset } = useEditGrid(gridRef);
 */
export const useEditGrid = <T extends GridHookProps>(gridRef: RefObject<AgGridReact<T> | undefined>, schema?: ObjectSchema<T>) => {
  const [resetTrigger, setResetTrigger] = useState<boolean>(false);

  /**
   * @description 그리드에 행을 추가하는 함수
   * @param blank 그리드의 빈 행
   */
  const addRow = useCallback(
    async (blank: T, autoFocus?: boolean, position?: number, defaultSelect?: boolean) => {
      blank.isNew = true;

      if (!blank.id || blank.id === '') {
        blank.id = v4();
      }

      if (gridRef && gridRef.current) {
        const selected = gridRef.current?.api.getSelectedNodes();

        if (schema) {
          await schema.validate(blank, { disableStackTrace: true, abortEarly: false }).catch((error: ValidationError) => {
            blank.errorField = error.inner.map((el) => el.path || '');
            blank.isError = true;
          });
        }

        const autoFocusCallback = (res: RowNodeTransaction) => {
          if (defaultSelect) {
            gridRef.current?.api.setNodesSelected({ nodes: res.add, newValue: true });
          }
          if (!autoFocus) return;
          const editableColumn = gridRef.current?.api
            .getColumnDefs()
            ?.filter<ColDef>((el): el is ColDef => {
              const isGroup = 'children' in el;
              return !isGroup;
            })
            .filter((el) => el.editable)[0].colId;
          editableColumn &&
            gridRef.current?.api.startEditingCell({
              rowIndex: selected.length > 0 ? (selected[0].rowIndex || 0) + 1 : 0,
              colKey: editableColumn
            });
        };

        if (position) {
          gridRef.current?.api.applyTransactionAsync({ add: [{ ...blank }], addIndex: position + 1 }, autoFocusCallback);
        } else if (selected.length > 0) {
          gridRef.current?.api.applyTransactionAsync({ add: [{ ...blank }], addIndex: (selected[0].rowIndex || 0) + 1 }, autoFocusCallback);
        } else {
          gridRef.current?.api.applyTransactionAsync({ add: [{ ...blank }], addIndex: 0 }, autoFocusCallback);
        }
      }
    },
    [gridRef]
  );

  /**
   * @description 선택된 행을 삭제하는 함수
   */
  const removeSelectedRows = useCallback(() => {
    if (!gridRef || !gridRef.current) return;

    if (gridRef.current!.api.getSelectedRows().length < 1) {
      return;
    }
    const selected = gridRef.current!.api.getSelectedRows();
    gridRef.current?.api.applyTransaction({ remove: selected });
  }, [gridRef]);

  /**
   * @description 지정된 인덱스의 행을 삭제하는 함수
   */
  const removeRowNode = useCallback(
    (node: IRowNode<T>) => {
      if (!gridRef || !gridRef.current || !node.data) return;
      gridRef.current?.api.applyTransaction({ remove: [node.data] });
    },
    [gridRef]
  );

  /**
   * @description 그리드에 수정된 데이터를 저장하는 함수
   * @param ev 그리드의 CellValueChangedEvent
   */
  const onUpdateCells = useCallback(
    (ev: CellValueChangedEvent<T, any>, overrideRedrawRows?: () => void) => {
      if (!gridRef || !gridRef.current) return;
      const updatedRows: T[] = [];

      gridRef.current?.api.forEachNode(async (rowNode) => {
        if (rowNode.rowIndex === ev.rowIndex) {
          const data = rowNode.data;

          if (data) {
            if (schema) {
              await schema
                .validate(data, { disableStackTrace: true, abortEarly: false })
                .then(() => {
                  // validated
                  data.isError = false;
                  data.errorField = [];
                })
                .catch((error: ValidationError) => {
                  data.isError = true;
                  data.errorField = error.inner.map((el) => el.path || '');
                });
            }

            data.isUpdated = true;
            updatedRows.push(data);
          }

          return;
        }
      });

      // gridRef.current?.api.applyTransaction({ update: updatedRows });

      if (overrideRedrawRows) {
        overrideRedrawRows();
      } else {
        // gridRef.current?.api.redrawRows({ rowNodes: [ev.node] });
      }
    },
    [gridRef]
  );

  /**
   * @description 그리드를 초기화하는 함수
   */
  const reset = useCallback(() => {
    try {
      if (gridRef && gridRef.current) {
        gridRef.current.api.deselectAll();
        setResetTrigger((prev) => !prev);
      }
    } catch (e) {
      console.error(e);
    }
  }, [gridRef]);

  /**
   * @description 선택된 행을 리턴하는 함수
   */
  const getSelectedRows = useCallback(() => {
    if (!gridRef || !gridRef.current) return [];
    return gridRef.current?.api ? gridRef.current?.api.getSelectedRows() || [] : [];
  }, [gridRef]);

  /**
   * @description 수정된 행을 반환하는 함수
   */
  const getUpdatedRows = useCallback(() => {
    if (!gridRef || !gridRef.current) return [];
    const updatedRows: T[] = [];

    gridRef.current?.api.forEachNode((node) => {
      if (!node.data) {
        return;
      }

      if (node.data.isUpdated || node.data.isNew) {
        updatedRows.push({ ...node.data, rowIndex: node.rowIndex });
      }
    });

    return updatedRows;
  }, [gridRef]);

  /**
   * @description 오류가 있는 행을 반환 함수
   * - 수정된 행 중에서 유효성 검사를 통과하지 못한 행을 반환한다
   * - 유효성 검사를 위해 schema가 필요함
   * - schema가 없을 경우 빈 배열을 반환
   * @returns ValidationError[] 배열의 index는 행의 rowIndex와 일치함
   */
  const getErrorRows = useCallback(async () => {
    try {
      if (!schema) {
        throw new Error('useEditGrid: schema is not defined');
      }

      const errorRows: ValidationError[][] = [];

      const updatedRows = getUpdatedRows();

      for (const row of updatedRows) {
        const rowIndex = row.rowIndex as number;

        await schema.validate(row, { disableStackTrace: true, abortEarly: false }).catch((error) => {
          errorRows[rowIndex] = error.inner.map((el: ValidationError) => {
            return {
              message: el.message,
              path: el.path,
              value: el.value
            };
          });
        });
      }

      return errorRows.filter((el) => !!el);
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      return [];
    }
  }, [gridRef]);

  /**
   * @description 수정된 행이 유효한지 검사하는 함수
   * @returns boolean
   */
  const isUpdatedRowsValid = useCallback(async () => {
    const rows = await getErrorRows();
    return rows.length === 0;
  }, [gridRef]);

  const exportToExcel = useCallback(
    async ({
      title,
      sheetName,
      allColumns,
      objectMap
    }: {
      title?: string;
      sheetName?: string;
      allColumns?: boolean;
      objectMap?: Record<string, string>;
    }) => {
      if (!gridRef || !gridRef.current) return;

      const today = new Date();
      const yy = today.getFullYear().toString().slice(2, 4);
      const mm = today.getMonth() + 1 < 10 ? `0${(today.getMonth() + 1).toString()}` : (today.getMonth() + 1).toString();
      const dd = today.getDate().toString();
      const fileName: string = `${title}_${yy + mm + dd}.xlsx`;
      gridRef.current?.api.exportDataAsExcel({
        fileName: fileName,
        exportedRows: 'filteredAndSorted',
        sheetName: sheetName,
        freezeRows: 'headers',
        headerRowHeight: 16,
        rowHeight: 16,
        allColumns: allColumns,
        columnKeys: gridRef.current.api.getAllDisplayedColumns().filter((el) => !el.getColDef().context?.exportOptions?.hide),
        processCellCallback: (params) => {
          if (
            params.column.getColDef().cellEditor === 'agRichSelectCellEditor' ||
            params.column.getColDef().cellRenderer === GridSelectRenderer ||
            params.column.getColDef().valueFormatter === GridSelectFormatter
          ) {
            const options = params.column.getColDef().context.selectOption;
            const result =
              options.find((el: SelectboxType) => el.value === params.value) ||
              options.find((el: SelectboxType) => el.label === params.value);
            return result ? result.label : params.formatValue(params.value) || '';
          } else if (objectMap && Object.keys(objectMap).includes(params.column.getColDef().field || '')) {
            const key = objectMap[params.column.getColDef().field || ''];
            return Array.isArray(params.value) ? params.value.map((el) => el[key]).join(', ') : params.value[key];
          } else if (params.column.getColDef().headerName === 'NO') {
            return params.node?.rowIndex === 0 ? 1 : params.node?.rowIndex && params.node?.rowIndex + 1;
          } else if (!params.column.getColDef().context?.exportOptions?.disableFormatter && params.column.getColDef().valueFormatter) {
            return params.formatValue(params.value) || '';
          }
          return params.value;
        }
      });
    },
    [gridRef]
  );

  /**
   *
   */
  const getExcelFile = useCallback(
    ({
      title,
      sheetName,
      allColumns,
      objectMap
    }: {
      title?: string;
      sheetName?: string;
      allColumns?: boolean;
      objectMap?: Record<string, string>;
    }) => {
      if (!gridRef || !gridRef.current) return;

      const today = new Date();
      const yy = today.getFullYear().toString().slice(2, 4);
      const mm = today.getMonth() + 1 < 10 ? `0${(today.getMonth() + 1).toString()}` : (today.getMonth() + 1).toString();
      const dd = today.getDate().toString();
      const fileName: string = `${title}_${yy + mm + dd}.xlsx`;
      return gridRef.current?.api.getDataAsExcel({
        fileName: fileName,
        exportedRows: 'filteredAndSorted',
        sheetName: sheetName,
        freezeRows: 'headers',
        headerRowHeight: 16,
        rowHeight: 16,
        allColumns: allColumns,
        processCellCallback: (params) => {
          if (
            params.column.getColDef().cellEditor === 'agRichSelectCellEditor' ||
            params.column.getColDef().cellRenderer === GridSelectRenderer ||
            params.column.getColDef().valueFormatter === GridSelectFormatter
          ) {
            const options = params.column.getColDef().context.selectOption;
            const result =
              options.find((el: SelectboxType) => el.value === params.value) ||
              options.find((el: SelectboxType) => el.label === params.value);
            return result ? result.label : params.formatValue(params.value) || '';
          } else if (objectMap && Object.keys(objectMap).includes(params.column.getColDef().field || '')) {
            const key = objectMap[params.column.getColDef().field || ''];
            return Array.isArray(params.value) ? params.value.map((el) => el[key]).join(', ') : params.value[key];
          } else if (params.column.getColDef().headerName === 'NO') {
            return params.node?.rowIndex === 0 ? 1 : params.node?.rowIndex && params.node?.rowIndex + 1;
          } else if (params.column.getColDef().valueFormatter) {
            return params.formatValue(params.value) || '';
          }
          return params.value;
        }
      });
    },
    [gridRef]
  );

  return {
    reset,
    addRow,
    removeSelectedRows,
    removeRowNode,
    resetTrigger,
    getSelectedRows,
    getUpdatedRows,
    onUpdateCells,
    getErrorRows,
    isUpdatedRowsValid,
    exportToExcel,
    getExcelFile
  };
};
