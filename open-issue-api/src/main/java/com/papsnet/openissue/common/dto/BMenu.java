package com.papsnet.openissue.common.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Null;
import lombok.*;
import org.springframework.lang.Nullable;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class BMenu extends BaseDTO {
    @Nullable
    public Integer oid;
    @Nullable
    public Integer menuOID;
    public String name;
    public String description;
    @Nullable
    public Integer ord;
    @Nullable
    public Integer isUse;
    public String link;
    @JsonProperty("childMenu")
    public List<BSubMenu> subMenu;
    public String menuType;
    @Nullable
    public String menuIcon;
    @Nullable
    public String remark;
    @Nullable
    public Integer isMain;
    @Nullable
    public Integer biOid;

    @Nullable
    private String page;
    @Nullable
    private String url;
}


