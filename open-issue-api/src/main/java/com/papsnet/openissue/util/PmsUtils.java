package com.papsnet.openissue.util;

import com.papsnet.openissue.common.constant.PmsConstant;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.WeekFields;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

public class PmsUtils {

    // region Public API using java.time.LocalDate

    public static LocalDate calculateFutureDate(LocalDate fromDate, int numberOfWorkDays, int workingDay, Collection<LocalDate> holidays) {
        LocalDate futureDate = fromDate;
        Set<LocalDate> holidaySet = toSet(holidays);

        if (workingDay == 5) {
            for (int i = PmsConstant.INIT_DURATION; i < numberOfWorkDays; i++) {
                if (isWeekend(futureDate) || isHoliday(futureDate, holidaySet)) {
                    // skip non-working day without consuming workday count
                } else {
                    futureDate = futureDate.plusDays(1);
                }
                while (isWeekend(futureDate) || isHoliday(futureDate, holidaySet)) {
                    futureDate = futureDate.plusDays(1);
                }
            }
        } else if (workingDay == 6) {
            for (int i = PmsConstant.INIT_DURATION; i < numberOfWorkDays; i++) {
                if (futureDate.getDayOfWeek() == DayOfWeek.SUNDAY || isHoliday(futureDate, holidaySet)) {
                    // skip
                } else {
                    futureDate = futureDate.plusDays(1);
                }
                while (futureDate.getDayOfWeek() == DayOfWeek.SUNDAY || isHoliday(futureDate, holidaySet)) {
                    futureDate = futureDate.plusDays(1);
                }
            }
        } else if (workingDay == 7) {
            for (int i = PmsConstant.INIT_DURATION; i < numberOfWorkDays; i++) {
                if (isHoliday(futureDate, holidaySet)) {
                    // skip
                } else {
                    futureDate = futureDate.plusDays(1);
                }
                // Note: Original C# also skips Sundays here; we mirror that behavior
                while (futureDate.getDayOfWeek() == DayOfWeek.SUNDAY || isHoliday(futureDate, holidaySet)) {
                    futureDate = futureDate.plusDays(1);
                }
            }
        }
        return futureDate;
    }

    public static int calculateFutureDuration(LocalDate fromDate, LocalDate toDate, int workingDay, Collection<LocalDate> holidays) {
        int betweenDayCnt = 0;
        Set<LocalDate> holidaySet = toSet(holidays);

        int i = 0;
        while (true) {
            LocalDate tmp = fromDate.plusDays(i);
            if (workingDay == 5) {
                if (!(isWeekend(tmp) || isHoliday(tmp, holidaySet))) {
                    betweenDayCnt++;
                }

                long daysBetween = toDate.toEpochDay() - tmp.toEpochDay();
                if (daysBetween <= 0) break;
                i++;
            } else if (workingDay == 6) {
                if (!(tmp.getDayOfWeek() == DayOfWeek.SATURDAY || isHoliday(tmp, holidaySet))) {
                    betweenDayCnt++;
                }

                long daysBetween = toDate.toEpochDay() - tmp.toEpochDay();
                if (daysBetween <= 0) break;
                i++;
            } else if (workingDay == 7) {
                if (!isHoliday(tmp, holidaySet)) {
                    betweenDayCnt++;
                }

                long daysBetween = toDate.toEpochDay() - tmp.toEpochDay();
                if (daysBetween <= 0) break;
                i++;
            } else {
                // Unsupported workingDay config; break to avoid infinite loop
                break;
            }
        }
        return betweenDayCnt;
    }

    public static int calculateGapFutureDuration(LocalDate fromDate, LocalDate toDate, int workingDay, Collection<LocalDate> holidays) {
        int betweenDayCnt = 0;
        Set<LocalDate> holidaySet = toSet(holidays);

        int i = 0;
        while (true) {
            LocalDate tmp = fromDate.plusDays(i);
            if (workingDay == 5) {
                if (!(isWeekend(tmp) || isHoliday(tmp, holidaySet))) {
                    betweenDayCnt++;
                }

                long daysBetween = toDate.toEpochDay() - tmp.toEpochDay();
                if (daysBetween == 0) {
                    break;
                } else if (daysBetween < 0) {
                    betweenDayCnt = (int) daysBetween;
                    break;
                }
                i++;
            } else if (workingDay == 6) {
                if (!(tmp.getDayOfWeek() == DayOfWeek.SATURDAY || isHoliday(tmp, holidaySet))) {
                    betweenDayCnt++;
                }

                long daysBetween = toDate.toEpochDay() - tmp.toEpochDay();
                if (daysBetween == 0) {
                    break;
                } else if (daysBetween < 0) {
                    betweenDayCnt = (int) daysBetween;
                    break;
                }
                i++;
            } else if (workingDay == 7) {
                if (!isHoliday(tmp, holidaySet)) {
                    betweenDayCnt++;
                }

                long daysBetween = toDate.toEpochDay() - tmp.toEpochDay();
                if (daysBetween == 0) {
                    break;
                } else if (daysBetween < 0) {
                    betweenDayCnt = (int) daysBetween;
                    break;
                }
                i++;
            } else {
                break;
            }
        }
        return betweenDayCnt;
    }

    public static int calculateDelay(LocalDate estEndDate, LocalDate actEndDate, int workingDay, List<LocalDate> holidays) {
        // Mirror C# logic: convert to yyyy-MM-dd (already LocalDate), then subtract 1
        int gap = calculateGapFutureDuration(estEndDate, actEndDate, workingDay, holidays);
        return gap - 1;
    }

    public static int calculateWeekNumber(LocalDate calculateDate) {
        WeekFields wf = WeekFields.of(DayOfWeek.SUNDAY, 1);
        return calculateDate.get(wf.weekOfYear());
    }

    // endregion

    // region Overloads for java.util.Date for convenience/compatibility

    public static java.util.Date calculateFutureDate(java.util.Date fromDate, int numberOfWorkDays, int workingDay, Collection<java.util.Date> holidays) {
        LocalDate from = toLocalDate(fromDate);
        Set<LocalDate> holidaySet = toSetDate(holidays);
        LocalDate res = calculateFutureDate(from, numberOfWorkDays, workingDay, holidaySet);
        return toDate(res);
    }

    public static int calculateFutureDuration(java.util.Date fromDate, java.util.Date toDate, int workingDay, Collection<java.util.Date> holidays) {
        return calculateFutureDuration(toLocalDate(fromDate), toLocalDate(toDate), workingDay, toSetDate(holidays));
    }

    public static int calculateGapFutureDuration(java.util.Date fromDate, java.util.Date toDate, int workingDay, Collection<java.util.Date> holidays) {
        return calculateGapFutureDuration(toLocalDate(fromDate), toLocalDate(toDate), workingDay, toSetDate(holidays));
    }

    public static int calculateDelay(java.util.Date estEnd, java.util.Date actEnd, int workingDay, List<java.util.Date> holidays) {
        LocalDate est = toLocalDate(estEnd);
        LocalDate act = toLocalDate(actEnd);
        // Truncate to date already done; subtract 1 as per C# implementation
        return calculateGapFutureDuration(est, act, workingDay, toSetDate(holidays)) - 1;
    }

    public static int calculateWeekNumber(java.util.Date date) {
        return calculateWeekNumber(toLocalDate(date));
    }

    // endregion

    // region Helpers

    private static boolean isWeekend(LocalDate d) {
        DayOfWeek dow = d.getDayOfWeek();
        return dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY;
    }

    private static boolean isHoliday(LocalDate d, Collection<LocalDate> holidays) {
        return holidays != null && holidays.contains(d);
    }

    private static Set<LocalDate> toSet(Collection<LocalDate> holidays) {
        if (holidays == null) return null;
        return new HashSet<>(holidays);
    }

    private static Set<LocalDate> toSetDate(Collection<java.util.Date> holidays) {
        if (holidays == null) return null;
        return holidays.stream().filter(Objects::nonNull).map(PmsUtils::toLocalDate).collect(Collectors.toSet());
    }

    private static LocalDate toLocalDate(java.util.Date date) {
        if (date == null) return null;
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private static java.util.Date toDate(LocalDate date) {
        if (date == null) return null;
        return java.util.Date.from(date.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    // endregion
}
