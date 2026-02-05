import { forwardRef } from 'react';
import CommonGrid, { CommongridOptions } from './CommonGrid';
import { AgGridReact } from 'ag-grid-react';

const SimpleGrid = forwardRef<AgGridReact, CommongridOptions>((props: CommongridOptions, ref) => {
  return <CommonGrid {...props} ref={ref} readonly />;
});

export default SimpleGrid;
