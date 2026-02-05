package com.papsnet.openissue.common.controller;

import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.dao.CalendarDAO;
import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.*;
import com.papsnet.openissue.common.service.DObjectService;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "캘린더 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/calendar")
public class CalendarController {
    private final ResponseService responseService;
    private final CalendarDAO calendarDAO;
    private final CommonDAO commonDAO;
    private final DObjectService dObjectService;

    @Operation(summary = "캘린더 조회", description = "캘린더 단건 조회")
    @GetMapping("/")
    public DataResult<Calendar> getCalendar(
            @Parameter(description = "캘린더 OID") @RequestParam(name = "oid", required = false) Integer oid,
            @Parameter(description = "타입") @RequestParam(name = "type", required = false) String type,
            @Parameter(description = "이름") @RequestParam(name = "name", required = false) String name
    ) {
        Calendar param = new Calendar();
        if (oid != null) param.setOid(oid);
        if (StringUtils.isNotBlank(type)) param.setType(type);
        if (StringUtils.isNotBlank(name)) param.setName(name);

        Calendar result = calendarDAO.selCalendar(param);
        return responseService.getDataResult(result);
    }

    @Operation(summary = "캘린더 목록 조회", description = "최신 캘린더 목록 조회")
    @GetMapping("/list")
    public ListResult<Calendar> getCalendars() {
        Calendar param = new Calendar();
        param.setType(CommonConstant.TYPE_CALENDAR);
        param.setIsLatest(1);
        List<Calendar> list = calendarDAO.selCalendars(param);
        if (list != null) {
            for (Calendar obj : list) {
                if (obj.getBpolicyOID() != null) {
                    BPolicy bp = commonDAO.selBPolicy(new BPolicy(obj.getType(), obj.getBpolicyOID()));
                    obj.setBpolicy(bp);
                }
            }
        }
        return responseService.getListResult(list);
    }

    @Operation(summary = "캘린더 상세 조회", description = "연/월/일 기준 캘린더 상세 목록 조회")
    @GetMapping("/details")
    public ListResult<CalendarDetail> getCalendarDetails(
            @Parameter(description = "캘린더 OID") @RequestParam(name = "calendarOID", required = false) Integer calendarOID,
            @Parameter(description = "연도") @RequestParam(name = "year", required = false) Integer year,
            @Parameter(description = "월") @RequestParam(name = "month", required = false) Integer month,
            @Parameter(description = "일") @RequestParam(name = "day", required = false) Integer day
    ) {
        CalendarDetail param = new CalendarDetail();
        if (calendarOID != null) param.setCalendarOID(calendarOID);
        if (year != null) param.setYear(year);
        if (month != null) param.setMonth(month);
        if (day != null) param.setDay(day);

        List<CalendarDetail> list = calendarDAO.selCalenderDetail(param);
        return responseService.getListResult(list);
    }

    @Transactional
    @Operation(summary = "캘린더 등록", description = "캘린더 및 기본 휴일 등록")
    @PostMapping("/registration")
    public DataResult<Integer> insertCalendar(@RequestBody Calendar data) {
        try {
            // Create DObject
            DObject dObj = new DObject();
            dObj.setName(data.getName());
            dObj.setType(CommonConstant.TYPE_CALENDAR);
            dObj.setTableNm(CommonConstant.TABLE_CALENDAR);
            // DObjectService will handle TdmxOID and policy/revision if needed
            Integer dOid = dObjectService.insDObject(dObj);

            data.setOid(dOid);
            calendarDAO.InsCalendar(data);

            if (data.getDefaultHoliday() != null && data.getDefaultHoliday() == 1) {
                List<CalendarDetail> holidayDefault = calendarDAO.SelCalendarHolidayDefailt();
                if (holidayDefault != null) {
                    for (CalendarDetail item : holidayDefault) {
                        item.setCalendarOID(dOid);
                        calendarDAO.InsCalendarDetail(item);
                    }
                }
            }
            return responseService.getDataResult(dOid);
        } catch (Exception ex) {
            return responseService.getFailResult(-1, ex.getMessage(), null);
        }
    }

    @Transactional
    @Operation(summary = "캘린더 상세 등록", description = "캘린더 상세(휴일/메모) 등록 및 리비전 처리")
    @PostMapping("/details/registration")
    public DataResult<Integer> insertCalendarDetail(@RequestBody Calendar data) {
        try {
            // Load base calendar info
            Calendar calendar = calendarDAO.selCalendar(Calendar.builder()
                    .type(CommonConstant.TYPE_CALENDAR)
                    .oid(data.getOid())
                    .build());
            if (calendar == null) {
                return responseService.getFailResult(-1, "캘린더를 찾을 수 없습니다.", null);
            }

            Integer targetOid;
            // Check existing details
            List<CalendarDetail> existing = calendarDAO.selCalenderDetail(CalendarDetail.builder()
                    .calendarOID(calendar.getOid())
                    .build());
            if (existing != null && !existing.isEmpty()) {
                // mark previous as not latest
                commonDAO.udtLatestDObject(new DObject(calendar.getOid()));
                // create new DObject sharing same TdmxOID
                DObject newObj = new DObject();
                newObj.setName(calendar.getName());
                newObj.setType(CommonConstant.TYPE_CALENDAR);
                newObj.setTableNm(CommonConstant.TABLE_CALENDAR);
                newObj.setTdmxOID(calendar.getTdmxOID());
                targetOid = dObjectService.insDObject(newObj);
                // copy calendar row
                Calendar tmpCalendar = new Calendar();
                tmpCalendar.setOid(targetOid);
                tmpCalendar.setWorkingDay(calendar.getWorkingDay());
                calendarDAO.InsCalendar(tmpCalendar);
            } else {
                targetOid = calendar.getOid();
            }

            if (data.getCalendarDetails() != null && !data.getCalendarDetails().isEmpty()) {
                for (CalendarDetail item : data.getCalendarDetails()) {
                    item.setCalendarOID(targetOid);
                    calendarDAO.InsCalendarDetail(item);
                }
            }
            return responseService.getDataResult(targetOid);
        } catch (Exception ex) {
            return responseService.getFailResult(-1, ex.getMessage(), null);
        }
    }
}
