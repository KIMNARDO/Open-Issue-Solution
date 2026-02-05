import { useMemo, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Box } from '@mui/material';
import CommonGrid from 'components/grid/CommonGrid';
//import { UserInformationRef } from './UserInformation';

const UserAuthority = () => {
  //const userInformationRef = useRef<UserInformationRef>(null);
  const gridRef = useRef<AgGridReact>(null);

  const grid = useMemo(() => {
    return (
      <CommonGrid
        key={`product-authority`}
        gridProps={{
          context: { id: 'userManage' },
          rowData: [
            { product: 'mobile', useYn: 'Y' },
            { product: 'auto', useYn: 'Y' },
            { product: 'camera', useYn: 'Y' },
            { product: 'watch', useYn: 'Y' }
          ],
          columnDefs: [{ field: 'product', headerName: '제품', flex: 2, minWidth: 180 }],
          rowSelection: { mode: 'multiRow', checkboxes: true },
          rowDragEntireRow: true,
          rowDragManaged: true,
          onRowClicked: ({ node }) => {
            node.isSelected() ? node.setSelected(false) : node.setSelected(true);
          }
        }}
        ref={gridRef}
        readonly
      />
    );
  }, []);
  return (
    <Box width={200} height={200}>
      {grid}
    </Box>
  );
};

export default UserAuthority;
