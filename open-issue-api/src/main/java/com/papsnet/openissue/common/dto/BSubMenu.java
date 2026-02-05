package com.papsnet.openissue.common.dto;

import lombok.*;
import org.springframework.lang.Nullable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BSubMenu {
    @Nullable
    public Integer oid;
    @Nullable
    public Integer menuOID;
    public String name;
    public String description;
    @Nullable
    public Integer ord;
    public String link;
    @Nullable
    public Integer isUse;
    @Nullable
    public String menuIcon;
    @Nullable
    public Integer isMain;
    @Nullable
    public String remark;
    @Nullable
    public Integer biOid;
    @Nullable
    private String page;
    @Nullable
    private String url;

}
