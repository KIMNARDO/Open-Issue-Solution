import { DatePicker, DatePickerProps } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

const BasicDatePicker = ({ ...props }: DatePickerProps<Dayjs>) => {
  return (
    <DatePicker
      {...props}
      sx={{
        '& .MuiInputAdornment-root': { marginLeft: 0, marginRight: 0, paddingLeft: '0px' },
        '& .MuiOutlinedInput-root': { paddingRight: '2px' },
        '& .MuiButtonBase-root': { marginRight: 0, padding: '4px', width: '32px' },
        '&.tableCellDatePicker .MuiOutlinedInput-notchedOutline': { border: 'none !important' },
        '&.tableCellDatePicker .MuiOutlinedInput-root': { boxShadow: 'none !important', paddingRight: 0, height: '28px' },
        '&.tableCellDatePicker .MuiInputBase-input': { paddingLeft: '4px' },
        '&.tableCellDatePicker .MuiIconButton-root': { width: 24, height: 24 }
      }}
    />
  );
};

export default BasicDatePicker;
