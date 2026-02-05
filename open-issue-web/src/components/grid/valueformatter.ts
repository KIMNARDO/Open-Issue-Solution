import { ValueFormatterFunc, ValueFormatterParams } from 'ag-grid-community';
import dayjs from 'dayjs';
import { ExColDef } from './grid.types';
import { calculateDelay } from 'pages/qms/open-issue/util';

export const commonDateFormatter = ({ value }: ValueFormatterParams): string => {
  return dayjs(value).isValid() ? dayjs(value).format('YYYY-MM-DD') : '-';
};

export const emptyValueFormatter = ({ value }: ValueFormatterParams): string => {
  return value ? value : '-';
};

export const issueDurationFormatter = (): Partial<ExColDef> => {
  return {
    valueFormatter: ({ data }) => {
      const duration = data.strDt && data.finDt ? dayjs(data.finDt).diff(data.strDt, 'day') : null;
      return duration ? `${duration}` : '-';
    }
  };
};

export const issueDelayFormatter = (): Partial<ExColDef> => {
  return {
    valueFormatter: ({ data }) => {
      const delay = calculateDelay(data);
      return delay && delay > 0 ? `+${Math.abs(delay)}` : '-';
    },
    cellStyle: ({ data }) => {
      const delay = calculateDelay(data);
      return delay && delay > 0
        ? { color: 'red', textAlign: 'center', backgroundColor: 'transparent' }
        : { color: 'text', textAlign: 'center', backgroundColor: 'transparent' };
    }
  };
};

export const createDtBasedIndexFormatter: ValueFormatterFunc = ({ data, api }) => {
  if (!data || !data.createDt) return '-';
  const rows: any[] = [];
  api.forEachNode((n) => rows.push(n.data));
  rows.sort((a, b) => (dayjs(a.createDt).isAfter(dayjs(b.createDt)) ? 1 : -1));
  const index = rows.findIndex((r) => r.oid === data.oid);
  return index !== null && index !== undefined ? `${index + 1}` : '-';
};
