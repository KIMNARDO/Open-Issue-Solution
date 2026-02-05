package com.papsnet.openissue.common.constant;

import java.time.Duration;

public class CommonConstant {
    public static Integer RETURN_SUCCESS = 1;

    public static String DEFINE_ROLE = "ROLE";
    public static String DEFINE_TYPE = "TYPE";
    
    public static String TYPE_CALENDAR = "CALENDAR";
    public static String TABLE_CALENDAR = "T_DCALENDAR";
    
    public static String TYPE_NOTICE = "NOTICE";
    
    public static String TYPE_COMPANY = "COMPANY";
    public static String TYPE_DEPARTMENT = "DEPARTMENT";
    public static String TYPE_PERSON = "PERSON";
    public static String TYPE_APPROVAL = "APPROVAL";
    public static String TYPE_APPROVAL_STEP = "APPROVAL_STEP";
    public static String TYPE_SAVE_APPROVAL = "SAVE_APPROVAL";
    public static String TYPE_APPROVAL_TASK = "APPROVAL_TASK";
    public static String TYPE_APPROVAL_APPROV = "APPROV";
    public static String TYPE_APPROVAL_AGREE = "AGREE";
    public static String TYPE_APPROVAL_DIST = "DIST";
    public static String TYPE_ROLE = "ROLE";
    
    public static String RELATIONSHIP_DEPARTMENT = "DEPARTMENT";
    public static String RELATIONSHIP_ROLE = "ROLE";
    
    public static String POLICY_APPROVAL_PREPARE = "Prepare";
    public static String POLICY_APPROVAL_STARTED = "Started";
    public static String POLICY_APPROVAL_COMPLETED = "Completed";
    public static String POLICY_APPROVAL_REJECTED = "Rejected";
    public static String POLICY_APPROVAL_TASK_PREPARE = "Prepare";
    public static String POLICY_APPROVAL_TASK_STARTED = "Started";
    public static String POLICY_APPROVAL_TASK_COMPLETED = "Completed";
    public static String POLICY_APPROVAL_TASK_REJECTED = "Rejected";
    public static String POLICY_APPROVAL_TASK_PAYING = "Paying";
    
    public static String TABLE_APPROVAL = "T_DAPPROVAL";
    public static String TABLE_APPROVAL_TASK = "T_DAPPROVAL_TASK";
    
    //System
    public static String POLICY_TRIGGER_CLASS = "CLASS";
    public static String POLICY_TRIGGER_FUNCTION = "FUNCTION";
    
    public static String ACTION_PROMOTE = "P";
    public static String ACTION_REJECT = "R";
    public static String ACTION_NON_AUTO = "N";
    
    public static String INIT_REVISION = "00";
    public static Integer MAX_NUMBER = 1155;
    public static Integer SINGLE_MAX_NUMBER = 34;
    public static String REVISION_PREFIX = "";
    
    public static String ACTION_YES = "Y";
    public static String ACTION_NO = "N";
    
    public static Integer PERSON_ACTION_USE = 1;
    public static Integer PERSON_ACTION_NOT_USE = 0;
    
    public static Integer PERSON_ACTION_HIDDEN_GUEST = 1;
    public static Integer PERSON_ACTION_NOT_HIDDEN_GUEST = 0;
    
    //Library
    public static String TYPE_LIBRARY = "LIBRARY";
    public static String TABLE_LIBRARY = "T_DLIBRARY";
    public static String NATION_LIBRARY = "국가";
    public static String JOBGROUP_LIBRARY = "직군";
    public static String JOBPOSITION_LIBRARY = "직급";
    public static String JOB_TITLE_LIBRARY = "직책";

    //OPENISSUEGROUP
    public static String TYPE_OPENISSUEGROUP = "OPENISSUEGROUP";
    public static String TABLE_OPENISSUEGROUP = "T_DOPENISSUE_GROUPDEF";
    
    //Icon
    public static Integer DEFAULT_ICONSIZE = 20;
    public static String ICON_COMPANY = "../images/comp.png";
    public static String ICON_DEPARTMENT = "../images/depart.png";
    public static String ICON_PERSON = "../images/user.png";
    public static String ICON_DOCUMENT = "../images/doctype.png";
    public static String ICON_DOCUMENT_DETAIL = "../images/docdetail.png";
    
    public static String TEXT_ENCRYPT_KEY = "SemsText";
    public static String FILE_ENCRYPT_KEY = "SemsFile";
    
    //Auth Division
    public static String AUTH_SYSTEM = "SYSTEM";
    public static String AUTH_CUSTOM = "CUSTOM";
    public static String AUTH_DIV_OWNER = "OWNER";
    public static String AUTH_DIV_ROLE = "ROLE";
    public static String AUTH_DIV_USER = "USER";
    public static String AUTH_DIV_PUBLIC = "PUBLIC";
    public static String AUTH_DIV_MANAGER = "MANAGER";
    
    //Auth Name
    public static String AUTH_NM_HIDDEN_GUEST = "HIDDEN_GUEST";
    public static String AUTH_NM_GUEST = "GUEST";
    
    //Auth
    public static String AUTH_VIEW = "View";
    public static String AUTH_MODIFY = "Modify";
    public static String AUTH_MEMBER_MODIFY = "MemberModify";
    public static String AUTH_DELETE = "Delete";
    public static String AUTH_DOWNLOAD = "Download";
    public static String AUTH_PROMOTE = "Promote";
    public static String AUTH_RELATION = "Relation";
    
    //Attribute
    public static String ATTRIBUTE_ITEM = "ITEM";
    public static String ATTRIBUTE_OEM = "OEM";
    public static String ATTRIBUTE_CAR = "CAR";
    public static String ATTRIBUTE_CUSTOMER = "CUSTOMER";
    public static String ATTRIBUTE_REASONCHANGE = "REASONCHANGE";
    public static String ATTRIBUTE_TDOC = "TDOC";
    public static String ATTRIBUTE_PDOC = "PDOC";
    public static String ATTRIBUTE_PRODUCED_PLACE = "PRODUCED_PLACE";
    public static String ATTRIBUTE_EPARTTYPE = "EPARTTYPE";
    public static String ATTRIBUTE_PSIZE = "PSIZE";
    public static String ATTRIBUTE_CARTYPE = "CARTYPE";
    public static String ATTRIBUTE_DEVSTEP = "DEVSTEP";
    public static String ATTRIBUTE_TESTITEMLIST = "TESTITEMLIST";
    public static String ATTRIBUTE_PROGRESS = "PROGRESS";
    public static String ATTRIBUTE_JOBTITLE = "JOBTITLE";
    public static String ATTRIBUTE_JOBPOSITION = "JOBPOSITION";
    
    public static String ATTRIBUTE_CUSTOMER_KOR = "고객사";
    public static String ATTRIBUTE_PRODUCTION_SITE = "생산지";

    
    //Doc Class
    public static String ATTRIBUTE_DOCUMENT = "일반문서";
    public static String ATTRIBUTE_PROJECT_DOCUMENT = "프로젝트 문서";
    public static String ATTRIBUTE_SALES_DOCUMENT = "영업수주 문서";
    
    //DashBoard Project Name
    public static String TYPE_DOCUMENT_KOR = "문서";
    public static String TYPE_PROJECT_KOR = "프로젝트";
    
    // 2021.02.28 김성현
    // File History
    
    
    public static String ACTION_FILE_HISTORY_UPLOAD = "업로드";
    public static String ACTION_FILE_HISTORY_DOWNLOAD = "다운로드";
    public static String ACTION_FILE_HISTORY_VIEW = "뷰어";
    
    //
    public static String ID_ADMIN = "admin";
    
    //QR 코드 생성 키
    public static String GAUTH_KEY = "papsnet67!@";
    public static String GAUTH_COMPANY = "ClipPLM.com";
    public static final Integer QRCODE_SIZE = 6;
    // 33초 후 만료
    public static Duration CODE_EXPIRE_TIME =  Duration.ofSeconds(33);
    
    //SMS 2차 인증
    public static String VERIFY_CHANNEL_SMS = "sms";
    public static String VERIFY_CHANNEL_EMAIL = "email";
    
    public static Integer CHECK_2FA_Y = 1;
    public static Integer CHECK_2FA_N = 0;
    
    public static Integer VERIFY_COUNT = 5;
    public static Duration VERIFY_RELEASE_TIME = Duration.ofMinutes(5);
    
    //CodeLibrary_ITEM&OEM
    public static Integer ITEM_GROUP_OID = 1;
    public static Integer OEM_OID = 274;
    public static Integer OPENISSUE_TYPE_OID = 90269;
    public static String IF_GB_NEW = "A";
    public static String IF_GB_UPDATE = "U";
    public static String IF_GB_DELETE = "D";
    public static String IF_STATUS_WAITING = "0";
    public static String IF_STATUS_COMPLITE = "4";
    public static String IF_STATUS_ERROR = "9";

    public static Integer OPENISSUETYPE_OID = 90269;
    
    public static Integer ATTRIBUTE_COST_STANDARD = 100000000;
    public static String OEM_TEST_CODE = "AAA999";
    
    public static Integer STATUS_IS_LATEST_Y = 1;
    public static Integer STATUS_IS_LATEST_N = 0;

    public static String ENCRYPTION_KEYCODE = "semskeycode";

    //25.10.14 cskim
    public static String ISSUE_STATE_LIBRARY_OPEN = "CLOSE";
    public static String ISSUE_STATE_LIBRARY_ING = "ING";
    public static String ISSUE_STATE_LIBRARY_CLOSE = "CLOSE";
}
