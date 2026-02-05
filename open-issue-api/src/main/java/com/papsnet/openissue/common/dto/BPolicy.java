package com.papsnet.openissue.common.dto;

import lombok.*;
import org.springframework.lang.Nullable;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BPolicy {
    @Nullable
    public Integer oid;
    public String type;
    public String name;
    @Nullable
    public Integer statusOID;
    public String statusNm;
    public String checkProgram;
    public String actionProgram;
    @Nullable
    public Integer statusOrd;
    public String isRevision;
    public String beforeActionOID;
    public String nextActionOID;
    public List<Integer> oids;

    public BPolicy(String type, Integer oid, List<Integer> oids) {
        this.type = type;
        this.oid = oid;
        this.oids = oids;
    }

    public BPolicy(String type, Integer oid) {
        this.type = type;
        this.oid = oid;
    }
}
