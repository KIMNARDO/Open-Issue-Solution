import { AgGridReact, AgGridReactProps } from 'ag-grid-react';
import { initStyles, setColDef } from './gridUtils';
import { AG_GRID_LOCALE_KR, AG_GRID_LOCALE_EN } from '@ag-grid-community/locale';
import {
  ColDef,
  themeQuartz,
  DataTypeDefinition,
  ExcelBorder,
  ExcelStyle,
  ExcelBorders,
  IRowNode,
  ProcessCellForExportParams,
  GetMainMenuItemsParams,
  DefaultMenuItem,
  MenuItemDef,
  FirstDataRenderedEvent,
  ThemeDefaultParams,
  BorderValue
} from 'ag-grid-community';
import { CSSProperties, ForwardedRef, forwardRef, Ref, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, CircularProgress, PaletteMode, useTheme } from '@mui/material';
import { ThemeMode } from 'types/config';
import { getSimilarity } from 'utils/similarity';
import { commonNotification } from 'api/common/notification';
import GridSelectEditor from 'components/cellEditor/SelectEditor';
import { SelectboxType } from 'components/select/selectbox.types';
import { v4 } from 'uuid';
import { useGridStateStore } from 'store/gridState.store';
import { ExColDef } from './grid.types';
import { gridIconOverrides } from './iconOverride';
import useConfig from 'hooks/useConfig';
import { useIntl } from 'react-intl';

const customComparator = (gridRef: Ref<AgGridReact<any>>, col: ExColDef) => {
  return (
    _valueA: any | null | undefined,
    _valueB: any | null | undefined,
    nodeA: IRowNode<any>,
    nodeB: IRowNode<any>,
    _isDescending: boolean
  ): number => {
    // 노드가 없거나 그룹 노드인 경우 기본 정렬
    if (!nodeA || !nodeB || !nodeA.data || !nodeB.data) {
      return 0;
    }

    if (gridRef && 'current' in gridRef) {
      if (col.cellDataType === 'number') {
        if (!_valueA && _valueB) return -1;

        if (_valueA && !_valueB) return 1;

        if (!_valueA && !_valueB) return 0;

        if (_valueA === _valueB) return 0;
        if (!_valueA || !_valueB) return 0;
        return _valueA - _valueB;
      }

      if (col.cellDataType === 'object') {
        const aObj = nodeA.data?.[col.field || ''];
        const bObj = nodeB.data?.[col.field || ''];
        return col.context?.comparator?.(aObj, bObj) || 0;
      }

      // API가 준비되지 않은 경우 값 직접 비교
      if (!gridRef.current?.api) {
        const aVal = _valueA?.toString() || '';
        const bVal = _valueB?.toString() || '';
        return aVal.localeCompare(bVal);
      }

      try {
        const aCellValue = gridRef.current.api.getCellValue({ rowNode: nodeA, colKey: col.field || '', useFormatter: true })?.toString();
        const bCellValue = gridRef.current.api.getCellValue({ rowNode: nodeB, colKey: col.field || '', useFormatter: true })?.toString();
        if (!aCellValue && bCellValue) return 1;

        if (aCellValue && !bCellValue) return -1;

        if (!aCellValue && !bCellValue) return 0;

        if (aCellValue === bCellValue) return 0;
        if (!aCellValue || !bCellValue) return 0;
        return aCellValue > bCellValue ? 1 : -1;
      } catch {
        // getCellValue 오류 시 값 직접 비교
        const aVal = _valueA?.toString() || '';
        const bVal = _valueB?.toString() || '';
        return aVal.localeCompare(bVal);
      }
    } else {
      return 0;
    }
  };
};

// 콤보박스 붙여넣기 검사
const customCellFromClipBoard = ({ value, column, node }: ProcessCellForExportParams) => {
  const colDef = column.getColDef();
  if (colDef.cellEditor !== 'agRichSelectCellEditor' && colDef.cellEditor !== GridSelectEditor) {
    if (colDef.cellDataType === 'number') {
      if (!value) return 0;
      const processedValue = value.replace(/\s/g, '');
      if (processedValue === '') return 0;
      // const regex = /[^0-9.]/g;
      const result = (value.toString() as string).replaceAll(',', '');
      if (isNaN(parseFloat(result))) {
        commonNotification.error('올바르지 않은 형식입니다');
        return '';
      }
      return parseFloat(result);
    }
    return value;
  }
  if (!colDef || !colDef.context || !colDef.context.selectOption) {
    return '';
  }

  // const selectDepValues = colDef.cellEditorParams.values({ data: node?.data }) as string[];
  // const selectDepLabels = colDef.cellEditorParams.labels({ data: node?.data }) as string[];
  // const selectBasicValues = colDef.cellEditorParams.values as string[];
  // const selectBasicLabels = colDef.cellEditorParams.labels as string[];

  const selectValues =
    (colDef.cellEditorParams && typeof colDef.cellEditorParams.values === 'function'
      ? (colDef.cellEditorParams.values({ data: node?.data }) as string[])
      : (colDef.context.selectOption as SelectboxType[]).map((el) => el.value)) || [];
  const selectLabels =
    (colDef.cellEditorParams && typeof colDef.cellEditorParams.labels === 'function'
      ? (colDef.cellEditorParams.labels({ data: node?.data }) as string[])
      : (colDef.context.selectOption as SelectboxType[]).map((el) => el.label)) || [];

  const goalSimilarity = 0.7;
  let hit = false;
  let hitLabel = '';
  let maxSimilarity = 0;

  selectLabels.forEach((el) => {
    const currentSimilarity = getSimilarity((value as string).toUpperCase(), el.toUpperCase());
    if (currentSimilarity > goalSimilarity && currentSimilarity > maxSimilarity) {
      maxSimilarity = currentSimilarity;
      hit = true;
      hitLabel = el;
      return true;
    }
    return false;
  });

  const hitValue = selectValues[selectLabels.findIndex((el) => el === hitLabel)] || '';

  return hit ? hitValue : selectValues.includes(value) ? value : '';
};

function setDarkMode(mode: PaletteMode) {
  document.body.dataset.agThemeMode = mode === ThemeMode.DARK ? 'dark' : 'light';
}

const excelHeaderBorderStyle: ExcelBorder = {
  color: '#d9d9d9',
  lineStyle: 'Continuous',
  weight: 1
};

const excelBorders: ExcelBorders = {
  borderTop: excelHeaderBorderStyle,
  borderLeft: excelHeaderBorderStyle,
  borderRight: excelHeaderBorderStyle,
  borderBottom: excelHeaderBorderStyle
};

const defaultColDef: ColDef = {
  wrapHeaderText: true,
  autoHeaderHeight: true,
  suppressHeaderMenuButton: false, // 필터 메뉴 버튼 활성화 (Smartsheet 스타일)
  suppressSizeToFit: false,
  unSortIcon: false,
  floatingFilter: false, // 필요시 true로 설정하여 헤더 아래 필터 입력창 표시
  filterParams: {
    buttons: ['reset', 'apply'],
    closeOnApply: true
  }
};

const defaultExcelStyle: ExcelStyle[] = [
  {
    id: 'header',
    font: { bold: true, fontName: 'Gulim' },
    alignment: { vertical: 'Center', horizontal: 'Left' },
    interior: { color: '#ffff99ff', pattern: 'Solid' },
    borders: excelBorders
  },
  {
    id: 'cell',
    alignment: {
      vertical: 'Center',
      horizontal: 'Left'
    },
    borders: excelBorders
  }
];

export interface CommongridOptions {
  gridProps?: AgGridReactProps;
  style?: CSSProperties;
  resetTrigger?: boolean;
  readonly?: boolean;
  autoSizeMode?: 'fullWidth' | 'fitContent';
  pagination?: boolean;
  requiredRow?: boolean;
  requiredRowMsg?: string;
  noDataMsg?: string;
  columnBorder?: boolean;
  theme?: Partial<ThemeDefaultParams>;
}

const CommonGrid = forwardRef(
  (
    {
      gridProps = { rowData: [], columnDefs: [] },
      style = { height: '100%', width: '100%' },
      resetTrigger,
      readonly,
      autoSizeMode = 'fullWidth',
      pagination = false,
      requiredRow = false,
      requiredRowMsg = '행을 선택해주세요',
      noDataMsg = '검색 결과가 없습니다',
      columnBorder = true,
      theme
    }: CommongridOptions,
    ref: ForwardedRef<AgGridReact>
  ) => {
    if (style) {
      initStyles(style);
    }
    const {
      palette,
      typography: { fontFamily, subtitle1 }
    } = useTheme();
    const { i18n } = useConfig();
    const { formatMessage } = useIntl();

    // 언어에 따른 AG Grid 로케일 선택
    const agGridLocale = useMemo(() => {
      return i18n === 'en' ? AG_GRID_LOCALE_EN : AG_GRID_LOCALE_KR;
    }, [i18n]);

    // 번역된 메시지
    const translatedMessages = useMemo(() => ({
      pinToColumn: formatMessage({ id: 'grid-pin-to-column' }),
      unpinAll: formatMessage({ id: 'grid-unpin-all' }),
      selectRow: formatMessage({ id: 'grid-select-row' }),
      noResult: formatMessage({ id: 'grid-no-result' }),
      invalidFormat: formatMessage({ id: 'msg-invalid-format' })
    }), [formatMessage]);
    const borderStyle: BorderValue = { width: 1, style: 'solid', color: palette.grey[300] };
    useEffect(() => {
      setDarkMode(palette.mode);
    }, [palette.mode]);

    const [uuid] = useState(v4());

    const { state } = useGridStateStore.getState();
    // const setState = useGridStateStore.setState;

    // const onStateUpdated = useCallback((e: StateUpdatedEvent): void => {
    //   const ignored: (keyof GridState | 'gridInitializing')[] = ['gridInitializing'];
    //   if (!e.context || !e.context.id) return;
    //   if (ignored.includes(e.sources[0])) return;

    //   setState((prevState) => ({ ...prevState, state: { ...prevState.state, [e.context.id]: e.api.getColumnState() } }));
    // }, []);

    const onFirstDataRendered = useCallback((e: FirstDataRenderedEvent): void => {
      if (e.context && e.context.id) {
        e.api.applyColumnState({ state: state[e.context.id], applyOrder: true });
      }
    }, []);

    const getMainMenuItems = useCallback((params: GetMainMenuItemsParams): (DefaultMenuItem | MenuItemDef)[] => {
      const prev = gridProps.getMainMenuItems ? gridProps.getMainMenuItems(params) : params.defaultItems;

      return [
        ...prev,
        {
          name: translatedMessages.pinToColumn,
          action: ({ api, column }) => {
            const targetCol = column?.getColDef().field || '';

            const index = api.getColumnDefs()?.findIndex((el) => {
              if (!('children' in el)) {
                return el.field === targetCol;
              }
              return false;
            });
            if (!index || index < 0) {
              return;
            }

            const pinned =
              api.getColumnDefs()?.map((el, idx) => {
                return { ...el, pinned: idx <= index ? 'left' : false } as ColDef;
              }) || [];
            api.setGridOption('columnDefs', pinned);
          },
          disabled: !params.column
        },
        {
          name: translatedMessages.unpinAll,
          action: ({ api }) => {
            const pinned =
              api.getColumnDefs()?.map((el) => {
                return { ...el, pinned: false } as ColDef;
              }) || [];
            api.setGridOption('columnDefs', pinned);
          }
        }
      ];
    }, [translatedMessages, gridProps.getMainMenuItems]);

    const dataTypeDefinitions: {
      [cellDataType: string]: DataTypeDefinition<any>;
    } = useMemo(() => {
      return {
        object: {
          baseDataType: 'object',
          extendsDataType: 'object',
          valueParser: (params) => ({ name: params.newValue }),
          valueFormatter: (params) => (params.value == null ? '' : params.value.name)
        },
        index: {
          baseDataType: 'text',
          extendsDataType: 'text'
        },
        number: {
          baseDataType: 'number',
          extendsDataType: 'number',
          valueParser: (params) => (params.newValue == null || params.newValue === '' ? 0 : Number(params.newValue))
        }
      };
    }, []);

    return (
      <Box
        id={`grid-wrapper-box-${uuid}`}
        sx={{
          height: '100%',
          width: '100%',
          // flexBasis: 'calc(100% - 52px)',
          flexShrink: 3,
          '& .ag-header-cell-comp-wrapper': { justifyContent: 'center' },
          '& .ag-header-cell-label': {
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
            maxHeight: 36
          },
          '& .ag-header-cell-text': {
            height: 'inherit',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis'
          },
          '& .ag-paging-panel': { backgroundColor: palette.primary.lighter, color: '#463A32' },
          '& .ag-row .ag-cell.error-cell': { background: `${palette.warning.lighter} !important` },
          '& .ag-row .ag-cell.disable-cell': { background: 'rgba(0,0,0,.03) !important' },
          '& .settingGrid .ag-row[aria-selected="false"]': { background: 'rgba(0,0,0,.1) !important' },
          '& .ag-row .ag-cell-wrapper': { height: '100%' },
          '& .ag-row .ag-cell-value': { height: '100%' },
          '& .rep-row': { border: '2px solid', borderColor: palette.primary.main },
          '& .disabled-row': { background: 'rgba(0,0,0,.2) !important' },
          '& .rep-row2': { outlineStyle: 'solid', outlineOffset: -2, outlineWidth: 2, outlineColor: palette.primary.main },
          // Smartsheet 스타일 - 완료된 행
          '& .completed-row': {
            background: 'rgba(0,0,0,.15) !important',
            opacity: 0.7,
            '& .ag-cell': { color: palette.grey[500] }
          },
          // Smartsheet 스타일 - 지연된 행 (연한 빨간 배경)
          '& .delayed-row': {
            background: 'rgba(244, 67, 54, 0.08) !important',
            '&:hover': { background: 'rgba(244, 67, 54, 0.12) !important' }
          },
          // Smartsheet 스타일 - 긴급 이슈 (좌측 빨간 보더)
          '& .urgent-row': {
            borderLeft: '4px solid #f44336 !important',
            '& .ag-cell:first-of-type': { paddingLeft: '8px' }
          },
          // Smartsheet 스타일 - 지시사항 (좌측 보라 보더)
          '& .instruction-row': {
            borderLeft: '4px solid #7b1fa2 !important',
            '& .ag-cell:first-of-type': { paddingLeft: '8px' }
          },
          '&': { '--ag-value-change-value-highlight-background-color': palette.primary.light },
          '& .ag-header-cell.required .ag-header-cell-label': { color: palette.primary.main },
          '& .ag-sort-indicator-icon': { display: 'flex', justifyContent: 'center', alignItems: 'center' }
        }}
      >
        <div style={{ ...style }}>
          <AgGridReact
            gridId={`commonGrid-${uuid}`}
            ref={ref}
            key={`${uuid}-${resetTrigger}`}
            {...gridProps}
            rowData={requiredRow ? [] : gridProps.rowData}
            rowBuffer={75}
            defaultColDef={defaultColDef}
            stopEditingWhenCellsLoseFocus={true}
            suppressScrollOnNewData={true}
            suppressLastEmptyLineOnPaste
            maintainColumnOrder
            cellFlashDuration={500}
            cellFadeDuration={1000}
            dataTypeDefinitions={dataTypeDefinitions}
            excelStyles={defaultExcelStyle}
            undoRedoCellEditing={true}
            undoRedoCellEditingLimit={10}
            loadingOverlayComponent={() => {
              return <CircularProgress color="primary" />;
            }}
            cellSelection={{
              handle: { mode: 'fill' }
            }}
            selectionColumnDef={{ minWidth: 35, maxWidth: 35, lockPinned: true, pinned: 'left', ...gridProps.selectionColumnDef }}
            localeText={agGridLocale}
            icons={gridIconOverrides}
            theme={themeQuartz.withParams({
              wrapperBorderRadius: '5px 5px 5px 5px',
              fontFamily,
              fontSize: subtitle1.fontSize,
              textColor: palette.info.darker,
              cellHorizontalPaddingScale: 0.5,
              rowHeight: 28,
              rowBorder: borderStyle,
              columnBorder: columnBorder ? borderStyle : undefined,
              headerHeight: 36,
              headerVerticalPaddingScale: 0,
              headerFontWeight: 500,
              headerFontSize: '13px',
              headerTextColor: palette.info.darker,
              headerColumnBorder: borderStyle,
              headerBackgroundColor: palette.primary.lighter,
              headerColumnResizeHandleColor: 'transparent',
              accentColor: palette.primary.main,
              pinnedColumnBorder: { style: 'solid', width: 2, color: palette.grey.A800 },
              pinnedRowBorder: { style: 'solid', width: 2, color: palette.grey.A800 },
              ...theme
            })}
            noRowsOverlayComponent={() => (requiredRow ? translatedMessages.selectRow : translatedMessages.noResult)}
            columnDefs={gridProps.columnDefs?.map((el) => {
              if ('children' in el) {
                // customComparator
                return { ...el, children: el.children.map((child) => setColDef(child)) };
              } else {
                // customComparator
                el.comparator = customComparator(ref, el);
                el.lockVisible = el.hide === true ? true : el.lockVisible;
                return setColDef(el, readonly === true ? false : true);
              }
            })}
            getMainMenuItems={getMainMenuItems}
            processCellFromClipboard={customCellFromClipBoard}
            // onStateUpdated={onStateUpdated}
            onFirstDataRendered={onFirstDataRendered}
            onGridPreDestroyed={({ api }) => {
              if (gridProps.onCellValueChanged) api.removeEventListener('cellValueChanged', gridProps.onCellValueChanged);
              api.setGridOption('rowData', null);
              api.setGridOption('columnDefs', null);
              api.setGridOption('loading', false);
              api.setGridOption('getMainMenuItems', undefined);
              api.setGridOption('onCellValueChanged', undefined);
              api.setGridOption('getContextMenuItems', undefined);
            }}
          />
        </div>
      </Box>
    );
  }
);

export default CommonGrid;
