import { CellClassParams, ColDef, GridApi, MenuItemDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { commonNotification } from 'api/common/notification';
import { User } from 'api/system/user/user.types';
import { GridSelectRenderer } from 'components/cellEditor/SelectEditor';
import { confirmation } from 'components/confirm/CommonConfirm';
import { SelectboxType } from 'components/select/selectbox.types';
import { CSSProperties, RefObject } from 'react';
import { read, utils, WorkBook } from 'xlsx';
import { PrintGridOptions } from './useEditGrid';

export const initStyles = (style: CSSProperties) => {
  if (!style.height) {
    style.height = '100%';
  }

  if (!style.width) {
    style.width = '100%';
  }
};

const calcPath = <T extends { path?: string[] }>(row: T, arr: T[], key: keyof T, upprKey: keyof T, path: string[]) => {
  if (!row[upprKey] || row[upprKey] === '') {
    return;
  }

  const parent = arr.find((item) => item[key] === row[upprKey]);
  if (parent) {
    const currentPath = path || [];
    currentPath.unshift(row[upprKey] as string);
    calcPath(parent, arr, key, upprKey, path);
  }
};
/**
 *
 * @param row path를 계산하려는 행
 * @param arr 전체 데이터
 * @param key 코드
 * @param upprKey 상위코드
 * @description treeData 정의 시 path 생성에 사용하는 함수
 * @example
 * const newRow: LibraryInterface = {
             ...blankRow,
             libCd: uniqId,
             upprCd: getSelectedRows()[0].libCd,
             path: [...getCurrentPath(getSelectedRows()[0], libData, 'libCd', 'upprCd'), uniqId]
           };
 */
export const getCurrentPath = <T extends { path?: string[]; id?: string }>(row: T, arr: T[], key: keyof T, upprKey: keyof T) => {
  const resultPath = [];
  resultPath.unshift((row[key] as string) || (row['id'] as string));
  calcPath(row, arr, key, upprKey, resultPath);
  return resultPath;
};

/**
 *
 * @param callback 콜백함수
 * @description 행 삭제 공통 그리드유틸함수
 * @example - 그리드 옵션 중
 * getContextMenuItems: (params) => {
             if (!params.node) {
               return [];
             }
             return [
               ...(params.defaultItems || []),
               'separator',
               rowDeleteMenu(() =>
                 removeDtl(undefined, {
                   onError: (error) => console.log(error),
                   onSuccess: () => {
                     alert('삭제되었습니다');
                     refetchDtl();
                   }
                 })
               )
             ];
           }
 */
export const rowDeleteMenu = (
  callback: () => void,
  disabled?: boolean,
  auth?: { user: User | null | undefined; authTargetPath?: string }
): MenuItemDef => ({
  name: '행 삭제',
  action: () => {
    if (auth && auth.user) {
      const authInfo = auth.user.groupAuthority?.find((f) => f.menuPath === (auth.authTargetPath ?? window.location.pathname));

      if (authInfo && authInfo['delPermAt'] === 'N') {
        commonNotification.warn('권한이 없습니다');
        return;
      }
    }

    confirmation({ title: '행 삭제', msg: '행 삭제의 경우 즉시 반영됩니다.\n진행하시겠습니까?' }).then((res) => {
      if (!res) {
        return;
      }
      if (callback) {
        callback();
      }
    });
  },
  disabled: disabled
});

/**
 *
 * @param gridRef grid Ref 객체
 * @param key 중복체크할 키 (단일, 다중)
 * @description 그리드 데이터 키 중복 체크, ref를 못찾을 경우 통과처리
 * @returns boolean
 * @example
 * const isDup = rowKeyCheck(gridRef, 'key');
 */
export const rowKeyCheck = <T>(gridRef: AgGridReact | undefined | null, key: keyof T | (keyof T)[]): boolean => {
  if (!gridRef) {
    return true;
  }
  if (Array.isArray(key) && key.length < 1) {
    return true;
  }
  if (Array.isArray(key)) {
    const keys = gridRef.api.getRenderedNodes().map((node) => {
      return key.map((el) => node.data[el]);
    });

    const result = keys.filter((el) => !el.includes('')).map((el) => el.sort().toString());
    const isDup = result.some((x) => {
      return result.indexOf(x) !== result.lastIndexOf(x);
    });
    return !isDup;
  } else {
    const gridData = gridRef.api
      .getRenderedNodes()
      .map((node) => node.data[key])
      .filter((el) => el && el !== '');
    const isDup = gridData.some((x) => {
      return gridData.indexOf(x) !== gridData.lastIndexOf(x);
    });
    return !isDup;
  }
};

export const setColDef = (col: ColDef, editable?: boolean) => {
  let column: ColDef;
  const initCellStyle = {
    // background: !editable ? 'transparent' : col.editable ? 'transparent' : 'rgba(0,0,0,.3)',
    background: 'transparent',
    textAlign: col.cellDataType === 'number' ? 'right' : 'center',
    ...col.cellStyle
  };
  const indexCellStyle: ColDef = {
    minWidth: 50,
    maxWidth: 70,
    cellStyle: { background: 'rgba(255,208,180,0.2)', textAlign: 'center' },
    valueGetter: ({ node, data }) => (!data ? '' : data.isNew ? 'New' : node && node.rowIndex! + 1)
  };

  column = {
    flex: 4,
    minWidth: 80,
    maxWidth: 450,
    cellStyle: initCellStyle,
    ...col
  };

  if (column.cellDataType === 'index') {
    column = { ...indexCellStyle, ...column };
  }

  // common properties ( error display )
  column.cellClass = !column.cellClass
    ? ({ data, colDef }: CellClassParams) => {
        if (!data) {
          return undefined;
        }
        if (colDef.field && data.errorField && data.errorField.includes(colDef.field) && data.isUpdated) {
          return 'error-cell';
        } else {
          return undefined;
        }
      }
    : column.cellClass;
  // colDef.field && data.errorField ? (data.errorField.includes(colDef.field) ?  : column.cellClass) : column.cellClass;

  const result = editable === false ? { ...column, editable: false } : column;

  return result;
};

export const getAllRows = <T>(api: GridApi<T>) => {
  const rows: T[] = [];

  api.forEachNode((rowNode) => {
    rows.push(rowNode.data as T);
  });

  return rows;
};

/**
 * Generates an HTML table from an XLSX worksheet
 * @param workbook - The XLSX workbook
 * @param worksheet - The worksheet to convert
 * @param wordBreak - Word break style
 * @returns HTML string representation of the table
 */
const generateTableFromWorksheet = (
  workbook: WorkBook,
  worksheet: any,
  wordBreak: string,
  headerStyle: string,
  headerCount?: number
): string => {
  // Get merged cells information
  const merges = worksheet['!merges'] || [];
  const range = utils.decode_range(worksheet['!ref'] || 'A1');
  const maxCol = range.e.c;
  const maxRow = range.e.r;

  // Create a matrix to track merged cells
  const mergedCellMatrix: { [key: string]: { rowspan: number; colspan: number } } = {};

  // Process merged cells
  merges.forEach((merge: any) => {
    const { s, e } = merge; // s: start, e: end
    const key = utils.encode_cell(s);
    mergedCellMatrix[key] = {
      rowspan: e.r - s.r + 1,
      colspan: e.c - s.c + 1
    };

    // Mark cells that are part of a merge but not the top-left cell
    for (let r = s.r; r <= e.r; r++) {
      for (let c = s.c; c <= e.c; c++) {
        if (r !== s.r || c !== s.c) {
          const skipKey = utils.encode_cell({ r, c });
          mergedCellMatrix[skipKey] = { rowspan: 0, colspan: 0 }; // Skip these cells
        }
      }
    }
  });

  // Build the table HTML - wrap with thead and tbody for better pagination
  let tableHtml = '<table border="1" cellspacing="0" cellpadding="5">';

  // Add thead for the header row
  tableHtml += '<thead>';
  for (let r = 0; r <= 0; r++) {
    // Only first row in header
    if (r <= maxRow) {
      // Make sure we have at least one row
      tableHtml += '<tr>';
      for (let c = 0; c <= maxCol; c++) {
        const cellRef = utils.encode_cell({ r, c });
        const mergeInfo = mergedCellMatrix[cellRef];

        // Skip cells that are part of a merge but not the top-left cell
        if (mergeInfo && mergeInfo.rowspan === 0) {
          continue;
        }

        const cell = worksheet[cellRef];
        const cellValue = cell ? utils.format_cell(cell) : '';

        // Add cell with appropriate rowspan and colspan if it's a merged cell
        const rowspanAttr = mergeInfo && mergeInfo.rowspan > 1 ? ` rowspan="${mergeInfo.rowspan}"` : '';
        const colspanAttr = mergeInfo && mergeInfo.colspan > 1 ? ` colspan="${mergeInfo.colspan}"` : '';

        // Different styling based on wordBreak setting
        let cellStyle = '';
        if (wordBreak === 'keep-all') {
          cellStyle = ` style="word-break: keep-all; white-space: nowrap; overflow: visible;"`;
        } else {
          cellStyle = ` style="word-break: ${wordBreak};"`;
        }

        tableHtml += `<th${rowspanAttr}${colspanAttr}${cellStyle}>${cellValue}</th>`;
      }
      tableHtml += '</tr>';
    }
  }
  tableHtml += '</thead>';

  // Add tbody for data rows
  tableHtml += '<tbody>';
  for (let r = 1; r <= maxRow; r++) {
    // Start from second row (1-indexed)
    tableHtml += '<tr>';
    for (let c = 0; c <= maxCol; c++) {
      const cellRef = utils.encode_cell({ r, c });
      const mergeInfo = mergedCellMatrix[cellRef];

      // Skip cells that are part of a merge but not the top-left cell
      if (mergeInfo && mergeInfo.rowspan === 0) {
        continue;
      }

      const cell = worksheet[cellRef];
      let cellAlignAtt = '';
      // if (cell && cell.t) {
      //   switch (cell.t) {
      //     case 's':
      //       cellAlignAtt = 'text-align: left;';
      //       break;
      //     case 'n':
      //       cellAlignAtt = 'text-align: right;';
      //       break;
      //     default:
      //       cellAlignAtt = 'text-align: left;';
      //       break;
      //   }
      // }

      const cellValue = cell ? utils.format_cell(cell) : '';

      // if (cellValue === 'Total') {
      //   cellAlignAtt = 'text-align: center;';
      // }

      // Add cell with appropriate rowspan and colspan if it's a merged cell
      const rowspanAttr = mergeInfo && mergeInfo.rowspan > 1 ? ` rowspan="${mergeInfo.rowspan}"` : '';
      const colspanAttr = mergeInfo && mergeInfo.colspan > 1 ? ` colspan="${mergeInfo.colspan}"` : '';

      const headerBackgroundAttr = r < (headerCount || 0) ? headerStyle : '';
      // Different styling based on wordBreak setting
      let cellStyle = '';
      if (wordBreak === 'keep-all') {
        cellStyle = ` style="word-break: keep-all; white-space: nowrap; overflow: visible; ${headerBackgroundAttr} ${cellAlignAtt}"`;
      } else {
        cellStyle = ` style="word-break: ${wordBreak};"`;
      }

      tableHtml += `<td${rowspanAttr}${colspanAttr}${cellStyle}>${cellValue}</td>`;
    }
    tableHtml += '</tr>';
  }
  tableHtml += '</tbody>';

  tableHtml += '</table>';
  return tableHtml;
};

/**
 * Generates CSS for printing with pagination
 */
const generatePrintStyles = (
  margins: { top?: number; right?: number; bottom?: number; left?: number },
  wordBreak: string,
  headerStyle: string
): string => {
  // Define table-layout based on wordBreak setting
  const tableLayout = wordBreak === 'keep-all' ? 'auto' : 'fixed';

  return `
      @page {
        margin: ${margins.top}in ${margins.right}in ${margins.bottom}in ${margins.left}in;
      }
  
      @media print {
          body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
          }
      }
      
      html, body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        width: 100%;
        height: 100%;
      }
      
      .print-container {
        width: 100%;
        overflow-x: visible;
        overflow-y: visible;
      }
      
      table {
        border-collapse: collapse;
        table-layout: ${tableLayout};
        width: ${wordBreak === 'keep-all' ? 'auto' : '100%'};
        page-break-inside: auto;
      }
      
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      
      th, td {
        padding: 8px;
        border: 1px solid #ddd;
        text-align: left;
        ${wordBreak === 'keep-all' ? 'white-space: nowrap; overflow: visible;' : `word-break: ${wordBreak};`}
      }
      
      th {
        ${headerStyle}
      }
      
      /* Critical for proper pagination */
      thead {
        display: table-header-group;
      }
      
      tbody {
        display: table-row-group;
      }
      
      @media print {
        html, body {
          width: 100%;
          height: auto;
        }
        
        .print-container {
          width: 100%;
          overflow: visible;
        }
        
        table {
          overflow: visible;
        }
      }
    `;
};

/**
 * Prints a grid from a blob using an iframe, handling merged cells and pagination
 * @param blob - 그리드 데이터
 * @param options - 인쇄 관련 옵션 (wordBreak, margins, title, headerCount)
 */
export const printGrid = (gridRef: RefObject<AgGridReact>, options: PrintGridOptions = {}): void => {
  if (!gridRef || !gridRef.current) return;
  const { wordBreak = 'normal', margins = { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 }, title = 'Grid Print' } = options;
  const headerStyle = `background-color: ${options.headerColor}; font-weight: bold; text-align: center;`;

  const blob = gridRef.current?.api.getDataAsExcel({
    processCellCallback: (params) => {
      if (
        params.column.getColDef().cellEditor === 'agRichSelectCellEditor' ||
        params.column.getColDef().cellRenderer === GridSelectRenderer
      ) {
        const options = params.column.getColDef().context.selectOption;
        const result =
          options.find((el: SelectboxType) => el.value === params.value) || options.find((el: SelectboxType) => el.label === params.value);
        return result ? result.label : '';
      }
      // else if (params.column.getColDef().headerName === 'NO') {
      //   return params.node?.rowIndex === 0 ? 1 : params.node?.rowIndex && params.node?.rowIndex + 1;
      // }
      return params.formatValue(params.value);
    }
  }) as Blob;

  // Create a hidden iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';

  // Set proper dimensions to ensure accurate rendering
  // This ensures the iframe has enough space to render content correctly
  iframe.style.width = '1000px';
  iframe.style.height = '800px';
  iframe.style.visibility = 'hidden';

  document.body.appendChild(iframe);

  // Read the blob as a file reader
  const reader = new FileReader();
  reader.onload = (e) => {
    if (!e.target || !e.target.result) return;

    try {
      // Parse the blob into workbook using XLSX
      const workbook = read(e.target.result, { type: 'array' });
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];

      // Get table HTML representation
      const htmlTable = generateTableFromWorksheet(workbook, worksheet, wordBreak, headerStyle, options.headerCount);

      // Generate styles for pagination and word-break
      const styles = generatePrintStyles(margins, wordBreak, headerStyle);

      // Get the iframe's document
      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) {
        console.error('Could not access iframe document');
        return;
      }

      // Write content to the iframe
      iframeDoc.open();
      iframeDoc.writeln(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${title}</title>
              <style>${styles}</style>
              <script>
                // Function to adjust cell widths after document is loaded
                function adjustCellWidths() {
                  const table = document.querySelector('table');
                  if (!table) return;
                  
                  // Get all table cells
                  const cells = document.querySelectorAll('th, td');
                  if (!cells.length) return;
                  
                  // Create a temporary div to measure text width
                  const measureDiv = document.createElement('div');
                  measureDiv.style.position = 'absolute';
                  measureDiv.style.visibility = 'hidden';
                  measureDiv.style.whiteSpace = 'nowrap';
                  measureDiv.style.fontFamily = getComputedStyle(cells[0]).fontFamily;
                  measureDiv.style.fontSize = getComputedStyle(cells[0]).fontSize;
                  measureDiv.style.fontWeight = getComputedStyle(cells[0]).fontWeight;
                  document.body.appendChild(measureDiv);
                  
                  // Calculate maximum width needed for each column
                  const columnWidths = {};
                  
                  cells.forEach((cell) => {
                    // Skip cells that are part of a rowspan/colspan but not the primary cell
                    if (cell.innerHTML === '') return;
                    
                    const colIndex = cell.cellIndex;
                    const colspan = parseInt(cell.getAttribute('colspan') || '1');
                    
                    // Measure the content width
                    measureDiv.innerHTML = cell.innerHTML;
                    const contentWidth = measureDiv.offsetWidth + 20; // Add padding
                    
                    // Divide width by colspan to get per-column width
                    const widthPerColumn = colspan > 1 ? contentWidth / colspan : contentWidth;
                    
                    // Update column width if this cell requires more space
                    for (let i = 0; i < colspan; i++) {
                      const currentCol = colIndex + i;
                      columnWidths[currentCol] = Math.max(columnWidths[currentCol] || 0, widthPerColumn);
                    }
                  });
                  
                  // Remove the measuring div
                  document.body.removeChild(measureDiv);
                  
                  // Apply column widths to the colgroup
                  const colgroup = document.createElement('colgroup');
                  
                  // Create col elements for each column
                  const columnCount = Math.max(...Object.keys(columnWidths).map(Number)) + 1;
                  for (let i = 0; i < columnCount; i++) {
                    const col = document.createElement('col');
                    if (columnWidths[i]) {
                      col.style.width = columnWidths[i] + 'px';
                      col.style.minWidth = columnWidths[i] + 'px';
                    }
                    colgroup.appendChild(col);
                  }
                  
                  // Add colgroup to table
                  table.insertBefore(colgroup, table.firstChild);
                  
                  // Set table width to accommodate all columns
                  const totalWidth = Object.values(columnWidths).reduce((sum, width) => sum + Number(width), 0);
                  table.style.width = totalWidth + 'px';
                  table.style.maxWidth = 'none';
                  
                  // Signal that adjustments are complete
                  document.body.setAttribute('data-adjusted', 'true');
                }
  
                // Execute when DOM is fully loaded
                document.addEventListener('DOMContentLoaded', function() {
                  if ('${wordBreak}' === 'keep-all') {
                    adjustCellWidths();
                  } else {
                    // Signal that adjustments are complete
                    document.body.setAttribute('data-adjusted', 'true');
                  }
                });
              </script>
            </head>
            <body>
              <div class="print-header" style="text-align: center; margin-bottom: 20px; font-size: 24px;">${title}</div>
              <div class="print-container">
                ${htmlTable}
              </div>
            </body>
          </html>
        `);
      iframeDoc.close();

      // Poll for the adjusted attribute to ensure content is fully prepared
      const checkAdjusted = setInterval(() => {
        if (iframeDoc.body.getAttribute('data-adjusted') === 'true') {
          clearInterval(checkAdjusted);

          // Print after adjustments are complete
          setTimeout(() => {
            try {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();

              // Remove the iframe after printing
              setTimeout(() => {
                document.body.removeChild(iframe);
              }, 1000);
            } catch (error) {
              console.error('Error during printing:', error);
              document.body.removeChild(iframe);
            }
          }, 100);
        }
      }, 100);

      // Fallback in case the adjustment never completes
      setTimeout(() => {
        clearInterval(checkAdjusted);
        if (iframeDoc.body.getAttribute('data-adjusted') !== 'true') {
          console.warn('Cell width adjustment timed out, printing anyway');
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();

          // Remove the iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }
      }, 5000);
    } catch (error) {
      console.error('Error processing grid:', error);
      document.body.removeChild(iframe);
    }
  };

  reader.readAsArrayBuffer(blob);
};
