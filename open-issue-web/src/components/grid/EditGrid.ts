import { AgGridReact } from 'ag-grid-react';
import { GridHookProps, PrintGridOptions } from './useEditGrid';
import { RefObject } from 'react';
import { ObjectSchema, ValidationError } from 'yup';
import { Palette, useTheme } from '@mui/material';
import { v4 } from 'uuid';
import { CellValueChangedEvent, ColDef } from 'ag-grid-enterprise';
import { SelectboxType } from 'components/select/selectbox.types';
import { GridSelectRenderer } from 'components/cellEditor/SelectEditor';
import { read, utils, WorkBook } from 'xlsx';

/**
 * @description EditGrid class - 테스트용
 */
export class EditGrid<T extends GridHookProps> {
  private static instance: EditGrid<any>;

  private gridRef: RefObject<AgGridReact<T>> = {} as RefObject<AgGridReact<T>>;
  private schema?: ObjectSchema<T>;
  private palette: Palette = useTheme().palette;
  resetTrigger: boolean = false;

  private headerStyle = `background-color: ${this.palette.primary.lighter}; font-weight: bold; text-align: center;`;

  private constructor(gridRef: RefObject<AgGridReact<T>>, schema?: ObjectSchema<T>) {
    this.gridRef = gridRef;
    this.schema = schema;
  }

  public static getInstance<I extends GridHookProps>(gridRef: RefObject<AgGridReact<I>>, schema?: ObjectSchema<I>) {
    return this.instance || (this.instance = new this(gridRef, schema));
  }

  addRow = async (blank: T, autoFocus?: boolean, position?: number) => {
    blank.isNew = true;

    if (!blank.id || blank.id === '') {
      blank.id = v4();
    }

    if (this.gridRef && this.gridRef.current) {
      const selected = this.gridRef.current?.api.getSelectedNodes();

      if (this.schema) {
        await this.schema.validate(blank, { disableStackTrace: true, abortEarly: false }).catch((error: ValidationError) => {
          blank.errorField = error.inner.map((el) => el.path || '');
          blank.isError = true;
        });
      }
      if (position) {
        this.gridRef.current?.api.applyTransaction({ add: [{ ...blank }], addIndex: position + 1 });
      } else if (selected.length > 0) {
        this.gridRef.current?.api.applyTransaction({ add: [{ ...blank }], addIndex: (selected[0].rowIndex || 0) + 1 });
      } else {
        this.gridRef.current?.api.applyTransaction({ add: [{ ...blank }], addIndex: 0 });
      }

      // auto focus
      if (autoFocus === undefined || autoFocus) {
        (async () => {
          setTimeout(() => {
            const editableColumn = this.gridRef.current?.api
              .getColumnDefs()
              ?.filter<ColDef>((el): el is ColDef => {
                const isGroup = 'children' in el;
                return !isGroup;
              })
              .filter((el) => el.editable)[0].colId;
            editableColumn &&
              this.gridRef.current?.api.startEditingCell({
                rowIndex: selected.length > 0 ? (selected[0].rowIndex || 0) + 1 : 0,
                colKey: editableColumn
              });
          }, 200);
        })();
      }
    }
  };

  removeSelectedRows = () => {
    if (this.gridRef.current!.api.getSelectedRows().length < 1) {
      return;
    }
    const selected = this.gridRef.current!.api.getSelectedRows();
    this.gridRef.current?.api.applyTransaction({ remove: selected });
  };

  onUpdateCells = (ev: CellValueChangedEvent<T, any>, overrideRedrawRows?: () => void) => {
    const updatedRows: T[] = [];

    this.gridRef.current?.api.forEachNode(async (rowNode) => {
      if (rowNode.rowIndex === ev.rowIndex) {
        const data = rowNode.data;

        if (data) {
          if (this.schema) {
            await this.schema
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

    this.gridRef.current?.api.applyTransaction({ update: updatedRows });

    if (overrideRedrawRows) {
      overrideRedrawRows();
    } else {
      // this.gridRef.current?.api.redrawRows({ rowNodes: [ev.node] });
    }
  };

  reset = () => {
    try {
      if (this.gridRef && this.gridRef.current) {
        this.gridRef.current.api.deselectAll();
        this.resetTrigger = !this.resetTrigger;
      }
    } catch (e) {
      console.error(e);
    }
  };

  getSelectedRows = () => (this.gridRef.current?.api ? this.gridRef.current?.api.getSelectedRows() || [] : []);

  getUpdatedRows = () => {
    const updatedRows: T[] = [];

    this.gridRef.current?.api.forEachNode((node) => {
      if (!node.data) {
        return;
      }

      if (node.data.isUpdated || node.data.isNew) {
        updatedRows.push({ ...node.data, rowIndex: node.rowIndex });
      }
    });

    return updatedRows;
  };

  getErrorRows = async () => {
    try {
      if (!this.schema) {
        throw new Error('useEditGrid: this.schema is not defined');
      }

      const errorRows: ValidationError[][] = [];

      const updatedRows = this.getUpdatedRows();

      for (const row of updatedRows) {
        const rowIndex = row.rowIndex as number;

        await this.schema.validate(row, { disableStackTrace: true, abortEarly: false }).catch((error) => {
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
  };

  isUpdatedRowsValid = async () => {
    const rows = await this.getErrorRows();
    return rows.length === 0;
  };

  exportToExcel = async (params?: string) => {
    const today = new Date();
    const yy = today.getFullYear().toString().slice(2, 4);
    const mm = today.getMonth() + 1 < 10 ? `0${(today.getMonth() + 1).toString()}` : (today.getMonth() + 1).toString();
    const dd = today.getDate().toString();
    const fileName: string = `JNTC_ECMS_${params}_${yy + mm + dd}.xlsx`;

    this.gridRef.current?.api.exportDataAsExcel({
      fileName: fileName,
      exportedRows: 'filteredAndSorted',
      freezeRows: 'headers',
      headerRowHeight: 30,
      processCellCallback: (params) => {
        if (
          params.column.getColDef().cellEditor === 'agRichSelectCellEditor' ||
          params.column.getColDef().cellRenderer === GridSelectRenderer
        ) {
          const options = params.column.getColDef().context.selectOption;
          const result =
            options.find((el: SelectboxType) => el.value === params.value) ||
            options.find((el: SelectboxType) => el.label === params.value);
          return result ? result.label : '';
        } else if (params.column.getColDef().headerName === 'NO') {
          return params.node?.rowIndex === 0 ? 1 : params.node?.rowIndex && params.node?.rowIndex + 1;
        }
        return params.value;
      }
    });
  };

  printGrid = (options: PrintGridOptions = {}): void => {
    const { wordBreak = 'normal', margins = { top: 0.5, right: 0.5, bottom: 0.5, left: 0.5 }, title = 'Grid Print' } = options;

    const blob = this.gridRef.current?.api.getDataAsExcel({
      processCellCallback: (params) => {
        if (
          params.column.getColDef().cellEditor === 'agRichSelectCellEditor' ||
          params.column.getColDef().cellRenderer === GridSelectRenderer
        ) {
          const options = params.column.getColDef().context.selectOption;
          const result =
            options.find((el: SelectboxType) => el.value === params.value) ||
            options.find((el: SelectboxType) => el.label === params.value);
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
        const htmlTable = this.generateTableFromWorksheet(workbook, worksheet, wordBreak, options.headerCount);

        // Generate styles for pagination and word-break
        const styles = this.generatePrintStyles(margins, wordBreak);

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

  generateTableFromWorksheet = (workbook: WorkBook, worksheet: any, wordBreak: string, headerCount?: number): string => {
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

        const headerBackgroundAttr = r < (headerCount || 0) ? this.headerStyle : '';
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

  generatePrintStyles = (margins: { top?: number; right?: number; bottom?: number; left?: number }, wordBreak: string): string => {
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
          ${this.headerStyle}
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
}
