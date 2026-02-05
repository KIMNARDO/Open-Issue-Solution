package com.papsnet.openissue.common.dao;

import com.papsnet.openissue.common.dto.Calendar;
import com.papsnet.openissue.common.dto.CalendarDetail;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CalendarDAO {
    Calendar selCalendar(Calendar param);
    List<Calendar> selCalendars(Calendar param);
    List<CalendarDetail> selCalenderDetail(CalendarDetail param);

    Integer InsCalendar(Calendar param);
    Integer InsCalendarDetail(CalendarDetail param);
    List<CalendarDetail> SelCalendarHolidayDefailt();
}
