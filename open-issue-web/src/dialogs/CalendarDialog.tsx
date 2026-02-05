import { useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { PickersActionBarProps, StaticDatePicker } from '@mui/x-date-pickers';
import CommonButton from 'components/buttons/CommonButton';

function CustomActionBar({ onAccept, onCancel, actions, className }: PickersActionBarProps) {
  if (actions == null || actions.length === 0) {
    return null;
  }

  return (
    <DialogActions className={className}>
      <CommonButton title="취소" variant="outlined" onClick={onCancel} />
      <CommonButton title="선택" variant="contained" onClick={onAccept} />
    </DialogActions>
  );
}

const CalendarDialog = ({
  isOpen,
  onClose,
  onAccept,
  title
}: {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (value: Dayjs) => void;
  title?: string;
}) => {
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const handleAccept = () => {
    if (!value) return;
    onAccept(value);
    onClose();
    setValue(dayjs());
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{title ?? '기한 설정'}</DialogTitle>
      <DialogContent>
        <StaticDatePicker
          value={value}
          onChange={handleChange}
          slots={{ actionBar: CustomActionBar, toolbar: () => null }}
          slotProps={{
            actionBar: { actions: ['cancel', 'accept'], onCancel: onClose, onAccept: handleAccept }
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CalendarDialog;
