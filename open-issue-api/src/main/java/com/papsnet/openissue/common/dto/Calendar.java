package com.papsnet.openissue.common.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@NoArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Calendar extends DObject {
    private Integer workingDay;        // 근무일수
    private Integer defaultHoliday;    // 기본 휴일수
    private List<CalendarDetail> calendarDetails;
}
