import { Box, Checkbox } from '@mui/material';
import { CustomCellRendererProps, CustomHeaderProps } from 'ag-grid-react';
import { useState } from 'react';

/**
 * @description editor 없이 체크박스를 사용하기 위한 renderer
 * @example
 * - 컬럼정의 중 cellRenderer에 해당 컴포넌트를 지정하여 사용
 * - cellRenderer: DirectCheckboxRenderer,
 * - 추가적인 속성은 컬럼정의의 context를 통해서 전달
 */
const DirectCheckboxRenderer = ({ value, node, api, column, context }: CustomCellRendererProps) => {
  const colContext = api.getColumnDef(column?.getColId()!)?.context;
  let values = {
    yes: 'Y',
    no: 'N'
  };

  switch (colContext?.checkboxOption?.valueType) {
    case 'YN':
      values = { yes: 'Y', no: 'N' };
      break;
    case 'NUMBER':
      values = { yes: '1', no: '0' };
      break;
    case 'trueFalse':
      values = { yes: 'true', no: 'false' };
      break;
    default:
      values = { yes: 'Y', no: 'N' };
  }

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
      <Checkbox
        value={value}
        onChange={(e, checked) => {
          const rowIdx = node.id;
          const rowNode = api.getRowNode(rowIdx!.toString())!;
          rowNode.setDataValue(column?.getColId()!, checked ? values.yes : values.no);
        }}
        disabled={context?.checkboxOption?.disabled}
        checked={value?.toLowerCase() === values.yes.toLowerCase() ? true : false}
        sx={{ p: '5px' }}
      />
    </Box>
  );
};

export const HeaderCheckBoxComponent = ({ api, column, context }: CustomHeaderProps) => {
  const [value, setValue] = useState(false);

  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      onClick={() => {
        setValue((prev) => !prev);
        api.forEachNode((n) => n.setDataValue(column.getColId()!, !value ? 'Y' : 'N'));
      }}
    >
      <Checkbox value={value} disabled={context?.checkboxOption?.disabled} checked={value} sx={{ p: '5px' }} />
    </Box>
  );
};

export default DirectCheckboxRenderer;
