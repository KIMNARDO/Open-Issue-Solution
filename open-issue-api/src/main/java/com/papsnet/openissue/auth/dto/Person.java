package com.papsnet.openissue.auth.dto;

import com.papsnet.openissue.common.dto.BPolicyAuth;
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
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Person extends DObject {
    public String id;
    public String password;
    public String email;
    public String rank;
    @Nullable
    public Integer isUse;
    @Nullable
    public Date enterDt;
    public String phone;
    @Nullable
    public Integer departmentOID;
    public List<Integer> departmentOIDs;
    public String departmentNm;
    public String imgSign;
    @Nullable
    public Integer jobTitleOID; // 직급
    public String jobTitleNm;
    @Nullable
    public Integer jobTitleOrd;
    @Nullable
    public Integer jobPositionOID;
    public String jobPositionNm;
    // 리소스
    public Integer projectCount;
    public Integer delayIssueCount;
    public Integer totalIssueCount;
    public Integer completedTask;
    public Integer totalTask;
    public Integer delayTask;
    public Integer yearDelayTask;
    public Integer yearDelayTaskDays;
    public List<Integer> yearDelayTaskList;
    @Nullable
    public Integer hiddenGuest;
    public String empNo;
    @Nullable
    public Date lastLogin;
    // Country info
    @Nullable
    public Integer nation; // 국가
    public String nationNm;
    // Product group
    @Nullable
    public Integer itemOID; // 제품군
    public String itemNm;
    // 2-Factor Authentication setting
    @Nullable
    public Integer check2FA; // 0/1 flag
    public String check2FAName;
    // Job group information
    @Nullable
    public Integer jobGroupOID;
    public String jobGroupNm;

    private JwtToken token;
    @Nullable
    private List<GroupAuthority> groupAuthority;

    public Person(Integer oid) {
        super(oid);
    }

    public Person(Integer oid, String type, String id) {
        super(oid);
        this.type = type;
        this.id = id;
    }

    public String extractAuths() {
        if(this.getBpolicyAuths() == null) return "";
        return String.join(",", this.getBpolicyAuths().stream().map(BPolicyAuth::getAuthNm).toList());
    }
}
