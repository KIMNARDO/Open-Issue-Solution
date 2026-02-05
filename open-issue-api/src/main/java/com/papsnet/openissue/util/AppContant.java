package com.papsnet.openissue.util;

/**
 * 어플리케이션 상수정의
 */
public class AppContant {
    public static final String APP_ID = "SAMSHIN";
    public static final String PREFIX_BEARER="Bearer ";
    public static final String REQ_PARAM_USER_UID = "reqUserUid";
    public static final String REQ_PARAM_ACCOUNT_ID = "reqAccountId";

    public static final String REQ_PARAM_ORG_CD = "reqOrgCd";
    public static final String REQ_PARAM_TEAM_CD = "reqTeamCd";

    public enum FileTypes{
        COMMON("COMMON"), // 일반
        REPORT("REPORT"); // 보고서

        String value;
        FileTypes(String value) { this.value = value; }

        public String getValue() { return this.value; }
    }

    public enum AsDocStatus{
        WAIT("WAIT"), // 접수대기
        PROGRESS("PROGRESS"), // 실행중
        APPROVAL("APPROVAL"), // 결재중
        COMPLETE("COMPLETE"); // 완료

        String value;
        AsDocStatus(String value) { this.value = value; }

        public String getValue() { return this.value; }
    }

    public enum QsStatus{
        PROGRESS("PROGRESS"), // 작성중
        COMPLETE("COMPLETE"), // 사용중
        PAUSED("PAUSED"), // 사용중지

        APPROVAL("APPROVAL"); // 결재중

        String value;
        QsStatus(String value) { this.value = value; }

        public String getValue() { return this.value; }
    }

    public enum QsDocStatus{
        PROGRESS("PROGRESS"), // 작성중
        APPROVAL("APPROVAL"), // 결재중
        COMPLETE("COMPLETE"), // 사용중
        PAUSED("PAUSED"); // 사용중지

        String value;
        QsDocStatus(String value) { this.value = value; }

        public String getValue() { return this.value; }
    }

    public enum QsDocType{
        DOCUMENT("DOCUMENT"), // 문서
        DIRECTORY("DIRECTORY"); // 디렉토리

        String value;
        QsDocType(String value) { this.value = value; }

        public String getValue() { return this.value; }
    }

    public enum UserRoles {
        USER("USER"),               // 사용자
        LEADER("LEADER"),           // 업무관리자
        MANAGER("MANAGER"),         // 부서관리자
        DIRECTOR("DIRECTOR"),       // 의사결정자
        PARTNER("PARTNER"),         // 파트너사
        SYSADMIN("SYSADMIN")        // 시스템 관리자
        ;

        String value;
        UserRoles(String value) { this.value = value; }

        public String getValue() { return this.value; }
    }

    public enum UserType {
        INTERNAL("I"),          // 내부사용자
        EXTERNAL("E"),          // 외부사용자
        SYSTEM("S");            // 시스템사용자

        String value;
        UserType(String value) { this.value = value; }

        public String getValue() { return this.value; }
    }

    // 부품구분
    public enum PartType {
        DEVELOPMENT("DD"),          // 직개발
        TRANSACTION("DT"),          // 직거래
        RESALE("RP");               // 사급

        String value;
        PartType(String value) { this.value = value; }

        public String getValue() { return this.value; }
    }

    /**
     * 프로그램 공통적으로 사용되는 상수값
     */
    public enum CommonValue {
        YES("Y"),
        NO("N"),
        ACTIVE("1"),
        INACTIVE("0")
        ;
        String value;

        CommonValue(String value) { this.value = value; }
        public String getValue() { return this.value; }
    }

    /**
     * Code Group value
     */
    public enum CodeGroupValue {
        MATERIAL_TYPE("B01"),
        PART_TYPE("B02"),
        CAR_TYPE("B03"),
        STEEL_GRADE("B05"),
        BBS_TYPE("C01"),
        YES_NO("C02"),
        USE_AT("C03"),
        DISPLAY_AT("C04"),
        DEPT("C06"),
        TEAM("C07"),
        COUNTRY("C08"),
        DOC_STATUS("C09"),
        ACCOUNT_TYPE("S01"),
        USER_ROLE("S03")
        ;
        String value;

        CodeGroupValue(String value) { this.value = value; }
        public String getValue() { return this.value; }
    }
}
