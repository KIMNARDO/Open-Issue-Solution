import { CalendarDetailSearch, CalendarSearch } from './calendar.types';
import calendarService from './calendarService';

export const calendarQueryOptions = {
  calendar: (params: CalendarSearch) => ({
    queryKey: ['calendar', params],
    queryFn: () => calendarService.getCalendar(params)
  }),
  calendarDetail: (params: CalendarDetailSearch) => ({
    queryKey: ['calendarDetail', params],
    queryFn: () => calendarService.getDetails(params)
  }),
  calendarList: () => ({
    queryKey: ['calendarList'],
    queryFn: () => calendarService.getList()
  })
};
