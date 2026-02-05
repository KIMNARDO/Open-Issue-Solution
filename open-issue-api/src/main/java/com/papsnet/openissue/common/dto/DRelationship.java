package com.papsnet.openissue.common.dto;

import com.papsnet.openissue.common.interfaces.IDObject;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class DRelationship {
    @Nullable
    public Integer oid;
    @Nullable
    public Integer fromOID;
    public IDObject fromData;
    @Nullable
    public Integer toOID;
    public IDObject toData;
    @Nullable
    public Integer count;
    public String type;
    @Nullable
    public Integer ord;
    @Nullable
    public Integer level;
    @Nullable
    public Date createDt;
    @Nullable
    public Integer createUs;
    @Nullable
    public Date deleteDt;
    @Nullable
    public Integer deleteUs;
}
