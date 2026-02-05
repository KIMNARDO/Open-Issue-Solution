package com.papsnet.openissue.common.controller;


import com.papsnet.openissue.common.dao.BMenuDAO;
import com.papsnet.openissue.common.dto.BMenu;
import com.papsnet.openissue.common.dto.ListResult;
import com.papsnet.openissue.common.service.BMenuService;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@Slf4j
@Tag(name = "시스템 메뉴 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/menu")
public class MenuController {
    private final ResponseService responseService;
    private final BMenuService bMenuService;

    @GetMapping("")
    public ListResult<BMenu> getMenus() {
        return responseService.getListResult(bMenuService.selBMenusByType("PLM"));
    }
}
