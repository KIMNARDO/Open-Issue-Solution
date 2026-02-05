import { CustomCellEditorProps } from 'ag-grid-react';
import BasicDatePicker from 'components/datepicker/BasicDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

const dateFormat = 'DD/MM/YYYY';

/**
 * @description grid 내 datePicker 사용을 위한 컴포넌트
 * @example
 * {
        headerName: '생성일',
        field: 'regDtm',
        editable: true,
        cellEditor: DirectDatePicker
      },
 */
const DirectDatePicker = ({ onValueChange, value }: CustomCellEditorProps) => {
  const [date, setDate] = useState<Dayjs | null>(dayjs(value, dateFormat));

  useEffect(() => {
    if (dayjs(date).isValid()) {
      onValueChange(dayjs(date).format(dateFormat));
    }
  }, [date]);

  return (
    <BasicDatePicker
      value={date}
      onChange={(value: Dayjs | null) => {
        if (value) {
          setDate(value);
        }
      }}
      slotProps={{ textField: { error: false } }}
    />
  );
};

export default DirectDatePicker;
