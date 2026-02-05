import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Box, IconButton, Paper, Typography, Popover, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useState, MouseEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { PickersCalendarHeaderProps, PickersDay } from '@mui/x-date-pickers';
import { useTheme } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { styled } from '@mui/system';

interface StaticCalendarProps {
  value?: Dayjs;
  onChange?: (date: string | null) => void;
  disableFuture?: boolean;
  disablePast?: boolean;
  minDate?: Dayjs;
  maxDate?: Dayjs;
  showMonthYearPicker?: boolean;
}

const dateFormat = 'YYYY-MM-DD';

const CalendarHeader = (props: PickersCalendarHeaderProps<Dayjs>) => {
  const { currentMonth, onMonthChange, disableFuture, disablePast } = props;
  const theme = useTheme();
  const [yearAnchorEl, setYearAnchorEl] = useState<HTMLElement | null>(null);
  const [monthAnchorEl, setMonthAnchorEl] = useState<HTMLElement | null>(null);
  const yearOpen = Boolean(yearAnchorEl);
  const monthOpen = Boolean(monthAnchorEl);

  const handleYearClick = (event: MouseEvent<HTMLElement>) => {
    setYearAnchorEl(event.currentTarget);
  };

  const handleMonthClick = (event: MouseEvent<HTMLElement>) => {
    setMonthAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setYearAnchorEl(null);
    setMonthAnchorEl(null);
  };

  const handleYearSelect = (year: number) => {
    const newDate = currentMonth.year(year);
    onMonthChange(newDate, 'left');
    handleClose();
  };

  const handleMonthSelect = (month: number) => {
    const newDate = currentMonth.month(month);
    onMonthChange(newDate, 'left');
    handleClose();
  };

  const handlePreviousMonth = () => {
    onMonthChange(currentMonth.subtract(1, 'month'), 'left');
  };

  const handleNextMonth = () => {
    onMonthChange(currentMonth.add(1, 'month'), 'right');
  };

  // Generate years for the dropdown (10 years before and after current year)
  const currentYear = dayjs().year();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

  // Months in Korean
  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          borderBottom: `1px solid ${theme.palette.divider}`,
          mb: 1
        }}
      >
        <IconButton
          onClick={handlePreviousMonth}
          disabled={disablePast && currentMonth.isSame(dayjs().startOf('month'), 'month')}
          size="small"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            onClick={handleYearClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', mr: 0.5 }}>
              {currentMonth.format('YYYY')}
            </Typography>
          </Box>
          {'/'}
          <Box
            onClick={handleMonthClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover'
              }
            }}
          >
            <Typography variant="h6" component="h2" sx={{ textAlign: 'center', ml: 1 }}>
              {currentMonth.format('MM')}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={handleNextMonth} disabled={disableFuture && currentMonth.isSame(dayjs().endOf('month'), 'month')} size="small">
          <FontAwesomeIcon icon={faChevronRight} />
        </IconButton>
      </Box>

      {/* Year Popover */}
      <Popover
        open={yearOpen}
        anchorEl={yearAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 300,
              width: 120,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.grey[400],
                borderRadius: '4px'
              }
            }
          }
        }}
      >
        <List dense>
          {years.map((year) => (
            <ListItem key={year} disablePadding>
              <ListItemButton
                selected={year === currentMonth.year()}
                onClick={() => handleYearSelect(year)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main + '!important',
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark + '!important'
                    }
                  }
                }}
              >
                <ListItemText primary={year} sx={{ textAlign: 'center' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>

      {/* Month Popover */}
      <Popover
        open={monthOpen}
        anchorEl={monthAnchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        slotProps={{
          paper: {
            sx: {
              maxHeight: 300,
              width: 120,
              overflow: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.grey[400],
                borderRadius: '4px'
              }
            }
          }
        }}
      >
        <List dense>
          {months.map((month, index) => (
            <ListItem key={month} disablePadding>
              <ListItemButton
                selected={index === currentMonth.month()}
                onClick={() => handleMonthSelect(index)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: theme.palette.primary.main + '!important',
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.dark + '!important'
                    }
                  }
                }}
              >
                <ListItemText primary={month} sx={{ textAlign: 'center' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

const CalendarDay = styled(PickersDay)(({ theme }) => ({
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main + '!important',
    color: theme.palette.primary.contrastText
    // '&:hover': {
    //   backgroundColor: theme.palette.dark + '!important'
    // }
  }
}));

export const StaticCalendar: React.FC<StaticCalendarProps> = ({
  value = dayjs(),
  onChange,
  disableFuture = false,
  disablePast = false,
  minDate,
  maxDate,
  showMonthYearPicker = false
}) => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(value);

  const handleDateChange = (newValue: Dayjs | null) => {
    setSelectedDate(newValue);
    if (onChange) {
      onChange(newValue?.format(dateFormat) ?? null);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: '100%' }}>
      <DateCalendar<Dayjs>
        value={selectedDate}
        onChange={handleDateChange}
        disableFuture={disableFuture}
        disablePast={disablePast}
        views={showMonthYearPicker ? ['year', 'month'] : ['day', 'month', 'year']}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '1000px !important',

          // 캘린더 본체 (요일 헤더 + day grid)
          '& .MuiDayCalendar-root': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          },

          // 요일 헤더 (고정 높이)
          '& .MuiDayCalendar-header': {
            flex: '0 0 32px',
            display: 'flex',
            justifyContent: 'space-evenly'
          },

          // 주 단위 컨테이너 (6줄 균등)
          '& .MuiDayCalendar-weekContainer': {
            flex: 1,
            display: 'flex',
            justifyContent: 'space-evenly', // 가로 균등 분배
            alignItems: 'center' // 세로 균등 분배
          },

          '& .MuiDayCalendar-monthContainer': {
            display: 'flex',
            flexDirection: 'column',
            rowGap: 7,
            paddingTop: '16px'
          },

          // 날짜 셀
          '& .MuiPickersDay-root': {
            flex: 0, // 균등분배 대신 space-evenly로 간격 유지
            aspectRatio: '1 / 1', // 정사각형
            width: '100%', // 필요시 최소 크기 조절
            maxWidth: '36px', // space-evenly 기준으로 크기 유지
            margin: 0
          },
          '& .MuiPickersSlideTransition-root': {
            height: '50vh',
            overflow: 'hidden' // 스크롤 방지
          }
        }}
        slots={{
          calendarHeader: CalendarHeader,
          day: CalendarDay
        }}
        slotProps={{
          day: ({ day }) => ({
            sx: {
              color: ({ palette }) => {
                if (day.day() === 0) {
                  return 'red';
                } else if (day.day() === 6) {
                  return palette.primary.main;
                }
                return undefined;
              }
            }
          })
        }}
      />
    </Paper>
  );
};

export default StaticCalendar;
