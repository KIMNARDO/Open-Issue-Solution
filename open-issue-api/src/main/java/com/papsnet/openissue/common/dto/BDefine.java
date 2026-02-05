package com.papsnet.openissue.common.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.lang.Nullable;

@Getter
@Setter
@NoArgsConstructor
public class BDefine {
    @Nullable
    public Integer oid;
    public String name;
    public String type;
    public String module;
    @Nullable
    public Integer ord;
    public String description;
    public String link;

    public BDefine(String type, String name) {
        this.type = type;
        this.name = name;
    }
    public BDefine(String module, String type, String name) {
        this.module = module;
        this.type = type;
        this.name = name;
    }
}
