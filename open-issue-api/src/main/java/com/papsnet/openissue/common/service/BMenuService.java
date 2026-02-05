package com.papsnet.openissue.common.service;

import com.papsnet.openissue.auth.dao.UserDAO;
import com.papsnet.openissue.common.dao.BMenuDAO;
import com.papsnet.openissue.common.dto.BMenu;
import com.papsnet.openissue.common.dto.BSubMenu;
import com.papsnet.openissue.common.exception.CBizProcessFailException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.*;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@Slf4j
@RequiredArgsConstructor
public class BMenuService {
    private final BMenuDAO bMenuDAO;
    private final UserDAO userDAO;

    public List<BMenu> selBMenus() {

        List<BMenu> resultMenus = bMenuDAO.selBMenu(BMenu.builder().menuType("BI").build());
        resultMenus.forEach(menu ->  {
            List<BSubMenu> subMenus = bMenuDAO.selBSubMenu(BSubMenu.builder().menuOID(menu.getOid()).build());
            if (subMenus != null && !subMenus.isEmpty()) {
                menu.setSubMenu(subMenus);
            }
        });
        return resultMenus;
    }

    public List<BMenu> selBMenusByType(String menuType) {
        List<BMenu> resultMenus = bMenuDAO.selBMenuByType(menuType);
        resultMenus.forEach(menu ->  {
            List<BSubMenu> subMenus = bMenuDAO.selBSubMenu(BSubMenu.builder().menuOID(menu.getOid()).build());
            if (subMenus != null && !subMenus.isEmpty()) {
                menu.setSubMenu(subMenus);
            }
        });
        return resultMenus;
    }

    public List<BMenu> selEditableMenu() {
        List<BMenu> resultMenus = bMenuDAO.selBMenu(BMenu.builder().menuType("BI").build());
        List<BMenu> addedMenus = new ArrayList<>();

        resultMenus.forEach(menu ->  {
            List<BSubMenu> subMenus = bMenuDAO.selBSubMenu(BSubMenu.builder().menuOID(menu.getOid()).build());
            if (subMenus != null && !subMenus.isEmpty()) {
                menu.setSubMenu(subMenus);
//                Iterator<BSubMenu> iterator = subMenus.iterator();
//                while (iterator.hasNext()) {
//                    BSubMenu target = iterator.next();
//                    addedMenus.add(BMenu.builder()
//                            .oid(target.getOid())
//                            .menuIcon(target.getMenuIcon())
//                            .name(target.getName())
//                            .isUse(target.getIsUse())
//                            .ord(target.getOrd())
//                            .description(target.getDescription())
//                            .link(target.getLink())
//                            .menuType("BI")
//                            .biOid(target.getBiOid())
//                            .page(target.getPage())
//                            .url((target.getUrl()))
//                            .build());
//                }
            }
        });

        resultMenus.addAll(addedMenus);


        return resultMenus.stream().filter(m -> m.getBiOid() != null).toList();
    }

    @Transactional
    public List<BMenu> mergeBIMenus(List<BMenu> menus, long reqUserUid) throws Exception {
        List<BMenu> result = new ArrayList<>();

        Map<Integer, Integer> menuOIDMap = new HashMap<>();

        menus.forEach(menu -> {
            if(menu.getBiOid() == null) menu.setBiOid(bMenuDAO.selMaxBiOid());
            if(menu.getMenuOID() != null) {
                boolean isNew = bMenuDAO.selCntBSubMenu(BSubMenu.builder().oid(menu.getOid()).build()) < 1;
                if(isNew) menu.setOid(bMenuDAO.selMaxSubMenuOid());
                Integer count = bMenuDAO.mergeBISubMenu(BSubMenu.builder()
                        .oid(menu.getOid())
                        .menuOID(menuOIDMap.get(menu.getMenuOID()))
                        .menuIcon(menu.getMenuIcon())
                        .name(menu.getName())
                        .ord(menu.getOrd())
                        .biOid(menu.getBiOid())
                        .isMain(menu.getIsMain())
                        .isUse(menu.getIsUse())
                        .remark(menu.getRemark())
                        .description(menu.getDescription())
                        .url(menu.getUrl())
                        .link(menu.getLink())
                        .build());
                if(count > 0) {
                    result.add(menu);
                }
            }else{
                boolean isNew = bMenuDAO.selCntBMenu(menu.getOid()) < 1;
                if(isNew) {
                    Integer newId = bMenuDAO.selMaxOid();
                    Integer prevId = menu.getOid();
                    menuOIDMap.put(prevId, newId);
                    menu.setOid(newId);
                }
                menuOIDMap.put(menu.getOid(), menu.getOid());
                Integer count = bMenuDAO.mergeBIMenu(menu);
                if(count > 0) {
                    result.add(menu);
                }
            }
        });

        // 그룹 동기화
        List<Integer> oids = menus.stream().map(BMenu::getOid).toList();
        for (long oid: oids) {
            userDAO.appendNotExistGroupAuth(oid, reqUserUid);
        }

        return result;
    }

    @Transactional
    public Integer deleteBIMenu(int oid, boolean isSubMenu) throws Exception {

        List<Integer> deleteTargets = new ArrayList<>();
        deleteTargets.add(oid);

        if(isSubMenu) {
            List<BSubMenu> bSubMenu = bMenuDAO.selBSubMenu(BSubMenu.builder().oid(oid).build());
            bMenuDAO.delBIUrl(bSubMenu.get(0).getBiOid());
            int result = bMenuDAO.delBISubMenu(bSubMenu.get(0).getOid());
            if(result < 1) throw new CBizProcessFailException("delete fail");
        }else{
            List<BSubMenu> subMenus = bMenuDAO.selBSubMenu(BSubMenu.builder().menuOID(oid).build());
            if(subMenus != null && !subMenus.isEmpty()) {
                subMenus.forEach(subm -> {
                    deleteTargets.add(subm.getOid());
                    bMenuDAO.delBIUrl(subm.getBiOid());
                    bMenuDAO.delBISubMenu(subm.getOid());
                });
            }

            BMenu bMenu = bMenuDAO.selBMenuByOid(oid);
            bMenuDAO.delBIUrl(bMenu.getBiOid());
            Integer result = bMenuDAO.delBIMenu(bMenu.getOid());
            if(result < 1) throw new CBizProcessFailException("delete fail");
        }





        for(int target: deleteTargets) {
            userDAO.deleteLinkedGroupAuthority(target);
        }
        return oid;
    }

    public Integer syncBMenu(Integer reqUserUid) throws Exception {
        List<BMenu> menus = selBMenus();
        List<Integer> allOids = menus.stream()
                .flatMap(menu -> Stream.concat(
                        Stream.of(menu.getOid()),                           // BMenu의 oid
                        Optional.ofNullable(menu.getSubMenu())
                                .orElseGet(Collections::emptyList)
                                .stream().map(BSubMenu::getOid)   // BSubMenu의 oid
                ))
                .toList();

        allOids.forEach(oid -> {
            try {
                userDAO.appendNotExistGroupAuth(oid.longValue(), reqUserUid.longValue());
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        });

        return 1;
    }
}
