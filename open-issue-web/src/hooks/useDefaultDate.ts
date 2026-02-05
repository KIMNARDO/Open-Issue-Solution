import dayjs, { Dayjs } from 'dayjs';

const commonDateFormat = 'YYYY-MM-DD';

const useDefaultDate = (startDate?: Dayjs, endDate?: Dayjs) => {
  const defaultEnd = dayjs().format(commonDateFormat);
  const defaultStart = dayjs().subtract(1, 'month').format(commonDateFormat);
  return { start: startDate?.format(commonDateFormat) ?? defaultStart, end: endDate?.format(commonDateFormat) ?? defaultEnd };
};

export default useDefaultDate;
