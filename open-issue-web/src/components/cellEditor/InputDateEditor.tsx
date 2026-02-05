import { Box, Input } from '@mui/material';
import { CustomCellEditorProps } from 'ag-grid-react';

const InputDateEditor = ({ onValueChange, value }: CustomCellEditorProps) => {
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Input
        type="date"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        contentEditable
        slotProps={{ input: { max: '9999-12-31', autoFocus: true } }}
      />
    </Box>
  );
};

export default InputDateEditor;
