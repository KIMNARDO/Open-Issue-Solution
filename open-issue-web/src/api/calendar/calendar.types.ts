import { DObject } from 'api/common/common.types';

export interface Calendar extends DObject {
  workingDay: number;
  defaultHoliday?: number;
}

export type CalendarSearch = Partial<Calendar>;

export interface CalendarDetail {
  calendarOID: number;
  calendarDetailOID: number;
  year: number;
  month: number;
  day: number;
  title: string;
  contents: string;
  isHoliday: number;
  fullDate: string;
}

export type CalendarDetailSearch = Partial<CalendarDetail>;
