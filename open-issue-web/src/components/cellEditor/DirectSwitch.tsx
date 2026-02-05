import { Box, Switch } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';

/**
 * @description editor 없이 스위치를 사용하기 위한 renderer
 * @example
 * - 컬럼정의 중 cellRenderer에 해당 컴포넌트를 지정하여 사용
 * - cellRenderer: DirectSwitchRenderer,
 * - 추가적인 속성은 컬럼정의의 context를 통해서 전달
 */
const DirectSwitchRenderer = ({ value, node, api, column, colDef }: CustomCellRendererProps) => {
  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
      <Switch
        value={value}
        onChange={(e, checked) => {
          const rowIdx = node.id;
          const rowNode = api.getRowNode(rowIdx!.toString())!;
          rowNode.setDataValue(column?.getColId()!, checked ? 'Y' : 'N');
        }}
        disabled={colDef?.context ? (colDef?.context?.switchOption?.disabled ? true : false) : false}
        checked={value === 'Y' ? true : false}
        sx={{ margin: '5px 0' }}
        size="small"
        readOnly
      />
    </Box>
  );
};

export default DirectSwitchRenderer;
