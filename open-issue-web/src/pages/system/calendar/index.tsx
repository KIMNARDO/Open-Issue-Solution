import TreeLayout from 'layout/Tree';
import { StaticCalendar } from 'components/calendar/StaticCalendar';
import { useEffect, useMemo, useState } from 'react';
import SideTree from './section/SideTree';
import Toolbar from './section/Toolbar';
import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import CalendarForm from './section/CalendarForm';
import CommonGrid from 'components/grid/CommonGrid';
import CommonButton from 'components/buttons/CommonButton';
import { useQuery } from '@tanstack/react-query';
import { calendarQueryOptions } from 'api/calendar/calendar.query';
import { Calendar, CalendarDetail } from 'api/calendar/calendar.types';
import { useRef } from 'react';
import { FormikProps } from 'formik';
import dayjs from 'dayjs';
import { TreeNode } from 'components/treeView/SimpleTree';
import useGridOption from './hook/useGridOption';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';

const dateFormat = 'YYYY-MM-DD';

const CalendarManage = () => {
  const calendarFormRef = useRef<FormikProps<Calendar>>(null);
  const addCalendarDetailDialogRef = useRef<BasicDialogRef>(null);

  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [rowData, setRowData] = useState<CalendarDetail[]>([]);
  const [checked, setChecked] = useState(true);
  const [selectedCalendarId, setSelectedCalendarId] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>(dayjs().format(dateFormat));

  const { rowSelection, onRowClicked, colDef } = useGridOption();

  const { data } = useQuery(calendarQueryOptions.calendarList());
  const { data: calendarDetail } = useQuery({
    ...calendarQueryOptions.calendarDetail({
      calendarOID: Number(selectedCalendarId),
      year: dayjs(currentDate).year(),
      month: dayjs(currentDate).month() + 1,
      day: dayjs(currentDate).date()
    }),
    enabled: !!selectedCalendarId && selectedCalendarId.length > 0 && !isNaN(Number(selectedCalendarId))
  });

  const handleSelectCalendar = (id: string) => {
    setSelectedCalendarId(id);
  };

  useEffect(() => {
    if (data) {
      const root: TreeNode = {
        id: 'root',
        label: '캘린더',
        children: data.map((item) => {
          return {
            id: item.oid.toString(),
            label: item.name
          };
        })
      };

      setTreeData([root]);
    }
  }, [data]);

  useEffect(() => {
    const selectedCalendar = data?.find((item) => item.oid.toString() === selectedCalendarId);
    if (selectedCalendar) {
      calendarFormRef.current?.resetForm({ values: { ...selectedCalendar } });
    } else {
      calendarFormRef.current?.resetForm();
    }
  }, [selectedCalendarId, data]);

  useEffect(() => {
    if (calendarDetail) {
      setRowData(calendarDetail);
    }
  }, [calendarDetail]);

  useEffect(() => {
    console.log(currentDate);
  }, [currentDate]);

  const memoTree = useMemo(
    () => (
      <SideTree
        checked={checked}
        position="right"
        fabPosition={{ bottom: 16, left: 16 }}
        fabSize="medium"
        slideWidth="22vw"
        slideHeight="100%"
        setChecked={setChecked}
        data={treeData}
        expandAction="doubleClick"
        onSelect={handleSelectCalendar}
      />
    ),
    [checked, treeData]
  );

  return (
    <TreeLayout tree={memoTree}>
      {!selectedCalendarId || isNaN(Number(selectedCalendarId)) ? (
        <>
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {'캘린더를 먼저 선택해주세요'}
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <Toolbar btnActions={{}} initialValues={{}} onSubmit={() => {}} title="달력" />
          <Divider />
          <br />
          <CalendarForm ref={calendarFormRef} onSubmit={() => {}} initialValues={{}} />
          <Box display="flex" mt={4} height="100%">
            <Grid container spacing={1}>
              <Grid item xs={8} p={1}>
                <StaticCalendar
                  onChange={(date) => {
                    if (date) {
                      setCurrentDate(date);
                    }
                  }}
                />
              </Grid>
              <Grid item xs={4} display="flex" flexDirection="column">
                <Stack
                  display="flex"
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  flexDirection={'row'}
                  p={1}
                  borderRight={1}
                  borderTop={1}
                  borderLeft={1}
                  borderColor={'#ccc'}
                >
                  <Typography>일정</Typography>
                  <Box display="flex" gap={1} alignItems={'center'}>
                    <CommonButton title="삭제" onClick={() => {}} size="small" />
                    <CommonButton
                      title="일정추가"
                      onClick={() => {
                        addCalendarDetailDialogRef.current?.open();
                      }}
                      size="small"
                    />
                    <CommonButton title="저장" onClick={() => {}} size="small" />
                  </Box>
                </Stack>
                <Box flex={1}>
                  <CommonGrid gridProps={{ rowData, columnDefs: colDef, loading: false, rowSelection, onRowClicked }} />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </>
      )}
    </TreeLayout>
  );
};

export default CalendarManage;
