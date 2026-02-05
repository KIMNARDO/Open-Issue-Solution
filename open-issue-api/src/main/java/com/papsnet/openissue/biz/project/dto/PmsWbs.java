package com.papsnet.openissue.biz.project.dto;

import com.papsnet.openissue.common.dto.DObject;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class PmsWbs {
    public Integer fromOid;
    public Integer rootOid;
    public Integer oid;
    public String processType;
    public String name;
    public Integer bPolicyOid;
    public String bPolicyCd;
    public String bPolicyNm;
    public Integer id;

    @Nullable
    public Integer dependency;

    @Nullable
    public String dependencyType;

    @Nullable
    public Date estStartDt;

    @Nullable
    public Date estEndDt;

    @Nullable
    public Integer estDuration;

    @Nullable
    public Date actStartDt;

    @Nullable
    public Date actEndDt;

    @Nullable
    public Integer actDuration;

    public Integer level;

    @Nullable
    public Integer complete;

    @Nullable
    public String no;

    @Nullable
    public Integer isSkipped;

    public List<PmsWbsMember> members;

    public List<PmsWbs> children;
}