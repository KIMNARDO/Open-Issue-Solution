import React, { useState, useRef } from 'react';
import { Popover, Box } from '@mui/material';
import CommonButton from './CommonButton';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs, { Dayjs } from 'dayjs';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers';
import { styled } from '@mui/system';
import { Calendar } from 'lucide-react';

interface DateSelectButtonProps {
  initialStartDate?: string;
  initialEndDate?: string;
  onSelect?: (startDate: string, endDate: string) => void;
  startDate?: string;
  endDate?: string;
  dateFormat?: string;
  size?: 'small' | 'medium' | 'large';
}

interface CustomPickerDayProps extends PickersDayProps<Dayjs> {
  isStartDate?: boolean;
  isEndDate?: boolean;
  isInRange?: boolean;
  isSaturday?: boolean;
  isSunday?: boolean;
  isDone?: boolean;
}

const CustomPickersDay = styled(PickersDay, {
  shouldForwardProp: (prop) => prop !== 'isStartDate' && prop !== 'isEndDate' && prop !== 'isInRange'
})<CustomPickerDayProps>(({ theme, isStartDate, isEndDate, isInRange, isSaturday, isSunday, isDone }) => ({
  margin: 0,
  ...(isInRange && {
    backgroundColor: theme.palette.primary.main + '!important',
    color: theme.palette.primary.contrastText + '!important',
    borderRadius: 0,
    ...(isSaturday && {
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%'
    }),
    ...(isSunday && {
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%'
    }),
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }
  }),
  ...(isStartDate && {
    backgroundColor: theme.palette.primary.main + '!important',
    color: theme.palette.primary.contrastText + '!important',
    borderRadius: !isDone ? undefined : 0,
    borderTopLeftRadius: '50%',
    borderBottomLeftRadius: '50%',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark + '!important'
    }
  }),
  ...(isEndDate && {
    backgroundColor: theme.palette.primary.main + '!important',
    color: theme.palette.primary.contrastText + '!important',
    borderRadius: !isDone ? undefined : 0,
    borderTopRightRadius: '50%',
    borderBottomRightRadius: '50%',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark + '!important'
    }
  })
})) as React.ComponentType<CustomPickerDayProps>;

const DateSelectButton = ({
  initialStartDate,
  initialEndDate,
  onSelect,
  startDate: externalStartDate,
  endDate: externalEndDate,
  dateFormat = 'YYYY-MM-DD',
  size
}: DateSelectButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 내부 상태는 초기값만 사용, 이후는 외부에서 제어
  const [internalStartDate, setInternalStartDate] = useState<Dayjs | null>(initialStartDate ? dayjs(initialStartDate, dateFormat) : null);
  const [internalEndDate, setInternalEndDate] = useState<Dayjs | null>(initialEndDate ? dayjs(initialEndDate, dateFormat) : null);

  // 외부에서 제공된 값이 있으면 사용, 없으면 내부 상태 사용
  const startDate = externalStartDate ? dayjs(externalStartDate, dateFormat) : internalStartDate;
  const endDate = externalEndDate ? dayjs(externalEndDate, dateFormat) : internalEndDate;

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const handleDateChange = (date: Dayjs | null) => {
    if (!date) return;

    // 시작일이 없으면 시작일 설정
    if (!startDate) {
      if (!externalStartDate) {
        setInternalStartDate(date);
      }
      return;
    }

    // 시작일만 있으면 종료일 설정
    if (!endDate) {
      // 선택한 날짜가 시작일보다 이전이면 시작일을 다시 설정
      if (date.isBefore(startDate)) {
        if (!externalStartDate) {
          setInternalStartDate(date);
        }
        if (!externalEndDate) {
          setInternalEndDate(null);
        }
      } else {
        // 종료일 설정
        if (!externalEndDate) {
          setInternalEndDate(date);
        }
        // 범위가 완성되면 onSelect 호출
        if (onSelect) {
          onSelect(startDate.format(dateFormat), date.format(dateFormat));
          handleClose();
        }
      }
      return;
    }

    // 시작일과 종료일이 모두 있으면 범위를 리셋하고 새로운 시작일 설정
    if (!externalStartDate) {
      setInternalStartDate(date);
    }
    if (!externalEndDate) {
      setInternalEndDate(null);
    }
  };

  const renderDay = ({ day, ...pickersDayProps }: PickersDayProps<Dayjs>) => {
    const isStartDate = startDate ? day.isSame(startDate, 'day') : false;
    const isEndDate = endDate ? day.isSame(endDate, 'day') : false;
    const isInRange = startDate && endDate ? day.isAfter(startDate, 'day') && day.isBefore(endDate, 'day') : false;
    const isSaturday = day.day() === 6;
    const isSunday = day.day() === 0;
    const isDone = !!startDate && !!endDate;

    return (
      <CustomPickersDay
        {...pickersDayProps}
        day={day}
        isStartDate={isStartDate}
        isEndDate={isEndDate}
        isInRange={isInRange}
        isSaturday={isSaturday}
        isSunday={isSunday}
        selected={isStartDate || isEndDate}
        isDone={isDone}
      />
    );
  };

  return (
    <>
      <CommonButton ref={buttonRef} title="달력" variant="standard" icon={<Calendar />} icononly="true" onClick={handleOpen} size={size} />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        slotProps={{
          paper: {
            sx: {
              padding: 1
            }
          }
        }}
      >
        <Box>
          <DateCalendar<Dayjs>
            sx={{
              '& .MuiDayCalendar-weekDayLabel': {
                margin: 0
              }
            }}
            value={endDate || startDate}
            onChange={handleDateChange}
            slots={{
              day: renderDay
            }}
          />
        </Box>
      </Popover>
    </>
  );
};

export default DateSelectButton;
