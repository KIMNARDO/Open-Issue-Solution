import { ValueFormatterFunc, ValueFormatterParams } from 'ag-grid-community';
import dayjs from 'dayjs';
import { ExColDef } from './grid.types';
import { calculateDelay } from 'pages/qms/qms/open-issue/util';

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
      if (!delay || delay <= 0) {
        return { color: 'inherit', textAlign: 'center', backgroundColor: 'transparent', fontWeight: 400 };
      }
      // 지연 심각도 그라데이션 (Smartsheet 스타일)
      if (delay >= 8) {
        return { color: '#b71c1c', textAlign: 'center', backgroundColor: 'rgba(244, 67, 54, 0.15)', fontWeight: 700 };
      }
      if (delay >= 4) {
        return { color: '#d32f2f', textAlign: 'center', backgroundColor: 'rgba(244, 67, 54, 0.08)', fontWeight: 600 };
      }
      // 1~3일
      return { color: '#e65100', textAlign: 'center', backgroundColor: 'transparent', fontWeight: 500 };
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
