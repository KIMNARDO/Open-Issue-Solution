package com.papsnet.openissue.common.dao;

import com.papsnet.openissue.common.dto.BMenu;
import com.papsnet.openissue.common.dto.BSubMenu;
import com.papsnet.openissue.common.dto.EditableBMenu;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.lang.Nullable;

import java.util.List;

@Mapper
public interface BMenuDAO {
    public List<BMenu> selBMenu(@Nullable BMenu menu);
    public BMenu selBMenuByOid(int oid);
    public List<BSubMenu> selBSubMenu(BSubMenu subMenu);
    public List<BMenu> selBMenuByType(String menuType);
    public EditableBMenu selEditableBMenu(int BIOID);
    public Integer mergeBIMenu(BMenu menu);
    public Integer mergeBISubMenu(BSubMenu menu);
    public Integer selMaxOid();
    public Integer selMaxSubMenuOid();
    public Integer selMaxBiOid();
    public Integer delBIMenu(Integer oid);
    public Integer delBISubMenu(Integer oid);
    public Integer delBIUrl(Integer oid);

    public Integer selCntBMenu(Integer oid);
    public Integer selCntBSubMenu(BSubMenu bSubMenu);
}
