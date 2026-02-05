import ServiceBase from 'api/ServiceBase';
import { Calendar, CalendarDetail, CalendarDetailSearch, CalendarSearch } from './calendar.types';

class CalendarService extends ServiceBase {
  private readonly domain: string = '/calendar';

  // 캘린더 목록 조회
  getList() {
    return this.service.get<Calendar[]>(`${this.domain}/list`);
  }

  // 캘린더 상세 조회
  getDetails(param: CalendarDetailSearch) {
    return this.service.get<CalendarDetail[]>(`${this.domain}/details`, { params: param });
  }

  // 캘린더 조회
  getCalendar(param: CalendarSearch) {
    return this.service.get<Calendar>(`${this.domain}`, { params: param });
  }

  // 캘린더 등록
  registCalendar(payload: Partial<Calendar>) {
    return this.service.post<Calendar>(`${this.domain}/registration`, payload);
  }

  // 캘린더 상세 등록
  registCalendarDetail(payload: Partial<CalendarDetail>) {
    return this.service.post<CalendarDetail>(`${this.domain}/details/registration`, payload);
  }
}

export default new CalendarService();
