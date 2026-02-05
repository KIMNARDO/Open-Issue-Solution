package com.papsnet.openissue.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@SuperBuilder
public class DObject {
    @Nullable
    public Integer oid;
    public String name;
    public String type;
    public String description;
    public String tableNm;
    @Nullable
    public BPolicy bpolicy;
    public Integer bpolicyOID;
    public String bpolicyNm;
    public List<BPolicyAuth> bpolicyAuths;
    public String revision;
    public String tdmxOID;
    @Nullable
    public Integer isLatest;
    @Nullable
    public Integer isReleasedLatest;
    public String thumbnail;
    @Nullable
    public Date createDt;
    @Nullable
    public Integer createUs;
    public String createUsNm;
    @Nullable
    public Date modifyDt;
    @Nullable
    public Integer modifyUs;
    public String modifyUsNm;
    @Nullable
    public Date deleteDt;
    @Nullable
    public Integer deleteUs;
    private List<Integer> oids;
    @Nullable
    public Integer gwDeptId;
    public String gwDeptCode;
    public Integer gwDeptIsUse;
    public List<Integer> gwDeptIds;
    @Nullable
    public Integer row;
    public String tempPartNo;
    @Nullable
    public Integer pageNum;
    @Nullable
    public Integer pageCount;

    public DObject(Integer oid) {
        this.oid = oid;
    }
    public DObject(Integer oid, String type) {
        this.oid = oid;
        this.type = type;
    }
}
