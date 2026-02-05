package com.papsnet.openissue.common.controller;

import com.papsnet.openissue.common.dto.BMenu;
import com.papsnet.openissue.common.dto.DataResult;
import com.papsnet.openissue.common.dto.ListResult;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import com.papsnet.openissue.common.exception.CModifictionFailException;
import com.papsnet.openissue.common.service.BMenuService;
import com.papsnet.openissue.common.service.ResponseService;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@Tag(name = "BI 시스템 메뉴 Controller")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/bi/menu")
public class BMenuController {
    private final BMenuService bMenuService;
    private final ResponseService responseService;
    @GetMapping("")
    public ListResult<BMenu> getMenus() {
        return responseService.getListResult(bMenuService.selBMenusByType("BI"));
    }

    @GetMapping("/editable")
    public ListResult<BMenu> getEditableMenus() {
        return responseService.getListResult(bMenuService.selEditableMenu());
    }

    @PostMapping("/merge")
    public ListResult<BMenu> mergeBIMenu(@RequestBody List<BMenu> menu, @Parameter(hidden = true) @RequestParam long reqUserUid) {
        try {
            return responseService.getListResult(bMenuService.mergeBIMenus(menu, reqUserUid));
        } catch(Exception e) {
            e.printStackTrace();
            throw new CModifictionFailException("업데이트 내용이 없습니다");
        }
    }

    @DeleteMapping("/delete/{oid}")
    public DataResult<Integer> deleteBIMenu(@PathVariable("oid") int oid) {
        try {
            return responseService.getDataResult(bMenuService.deleteBIMenu(oid, false));
        } catch (Exception e) {
            e.printStackTrace();
          throw new CBizProcessFailException("메뉴삭제 실패");
        }
    }

    @DeleteMapping("/delete/subMenu/{oid}")
    public DataResult<Integer> deleteBISubMenu(@PathVariable("oid") int oid) {
        try {
            return responseService.getDataResult(bMenuService.deleteBIMenu(oid, true));
        } catch (Exception e) {
            e.printStackTrace();
            throw new CBizProcessFailException("메뉴삭제 실패");
        }
    }


    @PostMapping("/sync")
    public DataResult<Integer> syncBMenu(@Parameter(hidden = true) @RequestParam int reqUserUid) throws Exception {
        return responseService.getDataResult(bMenuService.syncBMenu(reqUserUid));
    }

}
