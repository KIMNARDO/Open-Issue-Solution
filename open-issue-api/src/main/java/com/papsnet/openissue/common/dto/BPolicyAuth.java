package com.papsnet.openissue.common.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.lang.Nullable;

@Getter
@Setter
@NoArgsConstructor
public class BPolicyAuth {
    @Nullable
    public Integer oid;
    @Nullable
    public Integer policyOID;
    @Nullable
    public Integer authTargetOID;
    public String authTargetDiv;
    public String authNm;
    public String authTitle;
    public String authDiv;
    @Nullable
    public Integer authObjectOID;
    // ETC
    public String type;
    public String name;

    public BPolicyAuth(String type, Integer policyOID, String authTargetDiv, String authDiv) {
        this.type = type;
        this.policyOID = policyOID;
        this.authTargetDiv = authTargetDiv;
        this.authDiv = authDiv;
    }

    public BPolicyAuth(String type, Integer policyOID, String authTargetDiv, Integer authTargetOID, String authDiv) {
        this.type = type;
        this.policyOID = policyOID;
        this.authTargetDiv = authTargetDiv;
        this.authTargetOID = authTargetOID;
        this.authDiv = authDiv;
    }
}
