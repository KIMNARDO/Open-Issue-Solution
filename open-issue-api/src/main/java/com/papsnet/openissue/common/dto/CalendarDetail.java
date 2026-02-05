package com.papsnet.openissue.common.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@SuperBuilder
public class CalendarDetail {
    private Integer calendarOID;
    private Integer calendarDetailOID;
    private Integer year;
    private Integer month;
    private Integer day;
    private String title;
    private String contents;
    private Integer isHoliday;

    public String getFullDate() {
        String y = year == null ? "" : String.valueOf(year);
        String m = month == null ? "" : String.format("%02d", month);
        String d = day == null ? "" : String.format("%02d", day);
        return "#" + y + "-" + m + "-" + d + "#";
    }
}
