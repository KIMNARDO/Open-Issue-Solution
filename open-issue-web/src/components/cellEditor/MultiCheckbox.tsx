import { Box, Checkbox } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';

interface GridMultiCheckboxProps extends CustomCellRendererProps {
  checkboxes: { key: string }[];
}

/**
 *
 * @param checkboxes 데이터의 키 값 정의
 * @description - 그리드에 멀티체크박스 에디터를 추가하기 위한 컴포넌트
 */
const GridMultiCheckbox = ({ node, value, checkboxes, api, column, colDef }: GridMultiCheckboxProps) => {
  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
      {checkboxes.map((checkbox) => (
        <Checkbox
          name={`${checkbox.key}`}
          onChange={(e, checked) => {
            const rowIdx = node.id;
            const rowNode = api.getRowNode(rowIdx!.toString())!;
            rowNode.setDataValue(column?.getColId()!, checked ? { ...value, [checkbox.key]: true } : { ...value, [checkbox.key]: false });
          }}
          checked={value ? value[checkbox.key] : false}
          disabled={colDef?.editable ? false : true}
        />
      ))}
    </Box>
  );
};

/**
 *
 * @param values cellrenderer로 전달받은 value
 * @deprecated GridMultiCheckbox 에서 렌더링 및 데이터 set 동시에 하기 때문에 미사용 예정
 * @description multiCheckbox 렌더링용 컴포넌트
 */
export const GridMultiCheckboxRenderer = ({ values }: { values: { [k: string]: boolean } }) => {
  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'}>
      {Object.keys(values).map((key) => (
        <Checkbox checked={values[key]} />
      ))}
    </Box>
  );
};

export default GridMultiCheckbox;
