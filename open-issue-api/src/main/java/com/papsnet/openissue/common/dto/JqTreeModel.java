package com.papsnet.openissue.common.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.ibatis.type.Alias;

import java.util.List;

@Data
@NoArgsConstructor
@Alias("jqTreeModel")
public class JqTreeModel {
    public Integer parentId;
    public Integer id;
    public String label;
    public String value;
    public String icon;
    public Integer iconsize;
    public Boolean expanded;
    public Boolean selected;
    public List<JqTreeModel> items;

    // Custom Attr
    public String type;
    public List<String> checkitemtypes;
    public Integer gwDeptIsUse;
}
