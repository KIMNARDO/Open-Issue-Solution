import { MenuItem, OutlinedInput, Select } from '@mui/material';
import { ICellEditorParams, ValueFormatterParams } from 'ag-grid-community';
import { CustomCellEditorProps, CustomCellRendererProps } from 'ag-grid-react';
import { ExColDef } from 'components/grid/grid.types';
import { SelectboxType } from 'components/select/selectbox.types';

/**
 * 
 * @description grid 내 select 사용을 위한 컴포넌트
 * @example
 * - 컬럼 정의에서
 * {
      field: 'libOrd',
      headerName: '순서',
      editable: true,
      cellEditor: GridSelectEditor,
      context: {
        selectOption: [
          { label: '1', value: 'a' },
          { label: '2', value: 'b' },
          { label: '3', value: 'c' }
        ]
      }
    },
 */
const GridSelectEditor = ({ onValueChange, value, colDef }: CustomCellEditorProps) => {
  const renderMenuItem = () => {
    if (colDef.context && colDef.context.selectOption) {
      return colDef.context.selectOption.map((el: SelectboxType) => (
        <MenuItem key={`${colDef.field}-${el.value}`} value={el.value}>
          {el.label}
        </MenuItem>
      ));
    } else {
      return null;
    }
  };

  return (
    <Select
      labelId={`grid-select-label-${colDef.field}`}
      id={`grid-select-${colDef.field}`}
      input={<OutlinedInput placeholder="pholder" sx={{ width: '100%', height: '100%', display: 'flex' }} />}
      name={colDef.field}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      autoFocus
    >
      {renderMenuItem()}
    </Select>
  );
};

/**
 * @description 값이 아닌 label을 표시하고 싶은 경우에 사용한다
 * @example
 * 컬럼정의에서
 * {
      field: 'libOrd',
      headerName: '순서',
      editable: true,
      cellEditor: GridSelectEditor,
      cellRenderer: GridSelectRenderer,
      context: {
        selectOption: [
          { label: '1', value: 'a' },
          { label: '2', value: 'b' },
          { label: '3', value: 'c' }
        ]
      }
    },
 */
export const GridSelectRenderer = ({ colDef, value }: CustomCellRendererProps) => {
  if (!colDef?.context || !colDef?.context.selectOption) return null;
  return colDef?.context.selectOption.find((el: SelectboxType) => el.value?.toString() === value?.toString())?.label ?? value;
};

export const GridSelectFormatter = ({ colDef, value }: ValueFormatterParams) => {
  if (!colDef?.context || !colDef?.context.selectOption) return '';
  return colDef?.context.selectOption.find((el: SelectboxType) => el.value?.toString() === value?.toString())?.label ?? value;
};

export const GridDependentSelectEditor = <T,>({
  onValueChange,
  value,
  colDef,
  data,
  option
}: CustomCellEditorProps & { option: { refData: T[]; dep: keyof T; label: keyof T; value: keyof T } }) => {
  const renderMenuItem = () => {
    return option.refData
      .filter((el) => (el[option.dep] as string) === (data[option.dep] as string))
      .map((el) => (
        <MenuItem key={`${colDef.field}-${el[option.value] as string}`} value={el[option.value] as string}>
          {el[option.label] as string}
        </MenuItem>
      ));
  };

  return (
    <Select
      labelId={`grid-select-label-${colDef.field}`}
      id={`grid-select-${colDef.field}`}
      input={<OutlinedInput placeholder="pholder" sx={{ width: '100%', height: '100%', display: 'flex' }} />}
      name={colDef.field}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      autoFocus
    >
      {renderMenuItem()}
    </Select>
  );
};

// internal editor

const commonComboBoxOption = {
  allowTyping: true,
  filterList: true,
  searchType: 'matchAny',
  highlightMatch: true
  // valueListMaxWidth: 'auto'
};

const multiComboBoxOption = {
  multiSelect: true,
  searchType: 'matchAny',
  filterList: true,
  highlightMatch: true,
  valueListMaxHeight: 300,
  suppressMultiSelectPillRenderer: true
};

/**
 * 
 * @param options 콤보박스에 사용할 옵션
 * @returns grid comboBox 설정에 필요한 옵션 리턴
 * @example {  headerName: 'EQ/HM',
        field: 'eqType',
        editable: true,
        ...getGridComboBoxOptions(options),}
 */
export const getGridComboBoxOptions = (options: (SelectboxType & { useYn?: string })[]): ExColDef => ({
  cellEditor: 'agRichSelectCellEditor',
  cellEditorParams: {
    labels: options.filter((el) => el.useYn !== 'N').map((el) => el.label),
    values: options.filter((el) => el.useYn !== 'N').map((el) => el.value.toString()),
    formatValue: (value: string) => (!value ? '' : options.find((el) => el.value.toString() === value.toString())?.label || ''),
    ...commonComboBoxOption
  },
  valueFormatter: ({ value }: { value: string }) =>
    !value ? '' : options.find((el) => el.value.toString() === value.toString())?.label || value,
  // cellRenderer: GridSelectRenderer,
  context: { selectOption: options }
});

/**
 * 
 * @param options 콤보박스에 사용할 옵션
 * @param upperKey 상위 검색에 사용할 키
 * @param valueKey 값으로 사용할 키
 * @param labelKey 라벨로 사용할 키
 * @returns grid comboBox 설정에 필요한 옵션 리턴
 * @example { 
        headerName: '대공정',
        field: 'processCd',
        editable: true,
        ...getGridDepComboBoxOptions(commonInfo?.process || [], 'product', 'processCd', 'processNm')}
 */
export const getGridDepComboBoxOptions = <T extends { useYn?: string }>(
  options: T[],
  upperKey: keyof T,
  valueKey: keyof T,
  labelKey: keyof T
): ExColDef => ({
  cellEditor: 'agRichSelectCellEditor',
  cellEditorParams: {
    labels: ({ data }: ICellEditorParams) =>
      options
        .filter((el) => data[upperKey] === el[upperKey])
        .filter((el) => el.useYn === 'Y')
        .map((el) => el[labelKey]),
    values: ({ data }: ICellEditorParams) =>
      options
        .filter((el) => data[upperKey] === el[upperKey])
        .filter((el) => el.useYn === 'Y')
        .map((el) => el[valueKey]),
    ...commonComboBoxOption,
    formatValue: (value: string) => options.find((el) => (el[valueKey] as string) === value)?.[labelKey] || ''
  },
  valueFormatter: ({ value }: { value: string }) => (options.find((el) => (el[valueKey] as string) === value)?.[labelKey] as string) || '',
  // cellRenderer: GridSelectRenderer,
  context: { selectOption: options.map<SelectboxType>((el) => ({ label: el[labelKey] as string, value: el[valueKey] as string })) }
});

export const getGridMultiComboBoxOptions = (options: (SelectboxType & { useYn?: string })[]): ExColDef => ({
  cellEditor: 'agRichSelectCellEditor',
  cellEditorParams: {
    labels: options.filter((el) => el.useYn !== 'N').map((el) => el.label),
    values: options.filter((el) => el.useYn !== 'N').map((el) => el.value.toString()),
    // formatValue: (value: string | string[]) => {
    //   if (!value) return '';
    //   return Array.isArray(value)
    //     ? value.map((v) => options.find((el) => el.value.toString() === v.toString())?.label || '').join(',')
    //     : value
    //         .split(',')
    //         .map((v) => options.find((el) => el.value.toString() === v.toString())?.label || '')
    //         .join(',') || '';
    // },
    ...multiComboBoxOption
  },
  valueFormatter: ({ value }: { value: string | string[] }) => {
    if (!value) return '';
    return Array.isArray(value)
      ? value.map((v) => options.find((el) => el.value.toString() === v.toString())?.label || '').join(',')
      : value
          .split(',')
          .map((v) => options.find((el) => el.value.toString() === v.toString())?.label || '')
          .join(',') || '';
  },
  // cellRenderer: GridSelectRenderer,
  context: { selectOption: options }
});

export default GridSelectEditor;
