import { ColDef, ColGroupDef } from 'ag-grid-community';
import { GridChipOptions } from 'components/cellEditor/GridChipRenderer';
import { SelectboxType } from 'components/select/selectbox.types';

interface GridSwitchContext {
  disabled?: boolean;
}

type CheckboxValueType = 'YN' | 'NUMBER' | 'trueFalse';

interface GridCheckboxContext {
  disabled?: boolean;
  valueType?: CheckboxValueType;
}

interface CustomColumnContext {
  selectOption?: SelectboxType[];
  chipOption?: GridChipOptions[];
  switchOption?: GridSwitchContext;
  checkboxOption?: GridCheckboxContext;
  comparator?: (valueA: any, valueB: any) => number;
  exportOptions?: {
    hide?: boolean;
    disableFormatter?: boolean;
  };
}

export interface ExColDef<T = any> extends Omit<ColDef<T>, 'context'> {
  context?: CustomColumnContext;
}

export interface ExColGroupDef<T = any> extends Omit<ColGroupDef<T>, 'context'> {
  context?: CustomColumnContext;
}

export interface RowDataBase {
  id?: string;
  isNew?: boolean;
  isUpdated?: boolean;
  rowIndex?: number;
  isError?: boolean;
  errorField?: string[];
  path?: string[];
}
