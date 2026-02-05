package com.papsnet.openissue.common.constant;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PmsConstant {
    public static String MODULE_PMS = "PMS";

    public static String TYPE_PROJECT = "PROJECT";
    public static String TYPE_PROJECT_TEMP = "PROJECT_TEMP";
    public static String TYPE_GATE = "GATE";
    public static String TYPE_PHASE = "PHASE";
    public static String TYPE_TASK = "TASK";
    public static String TYPE_ISSUE_PROJECT = "ISSUE_PROJECT";
    public static String TYPE_ISSUE_TASK = "ISSUE_TASK";
    public static String TYPE_RISK = "RISK";
    public static String TYPE_BASE_LINE_PROJECT = "BASE_LINE_PROJECT";
    public static String TYPE_GATEVIEW_METTING = "METTING";
    public static String TYPE_GATEVIEW_CHECKLIST = "CHECKLIST";
    public static String TYPE_RELIABILITY = "RELIABILITY";
    public static String TYPE_RELIABILITY_REPORT = "RELIABILITY_REPORT";
    public static String TYPE_TOTAL = "TOTAL";
    public static String TYPE_PROJECT_PROGRAM = "PROJECT_PROGRAM";
    public static String TYPE_EPL = "EPL";
    public static String TYPE_EPLITEM = "EPLITEM";
    public static String TYPE_2DFile = "2DFile";
    public static String TYPE_3DFile = "3DFile";
    public static String TYPE_CHECKLIST = "CHECKLIST";

    // 이슈 체크박스 타입
    public static String ATTRIBUTE_ISSUE_SPEC = "SPEC";
    public static String ATTRIBUTE_ISSUE_4M = "4M";
    public static String ATTRIBUTE_ISSUE_QUALITY = "QUALITY";
    public static String ATTRIBUTE_ISSUE_ETC = "ETC";

    public static String ATTRIBUTE_ISSUE_TYPE = "이슈구분";
    public static String ATTRIBUTE_ISSUE_STATE = "이슈상태";
    public static String ATTRIBUTE_ISSUE_PLACEOFISSUE = "발생처";
    public static String ATTRIBUTE_ISSUE_SPECNm = "사양";
    public static String ATTRIBUTE_ISSUE_4MNm = "4M";
    public static String ATTRIBUTE_ISSUE_QUALITYNm = "품질";
    public static String ATTRIBUTE_ISSUE_ETCNm = "기타";

    public static String ATTRIBUTE_OEM = "OEM";
    public static String ATTRIBUTE_CAR = "CAR";

    public static String ATTRIBUTE_CEO = "CEO";
    public static String ATTRIBUTE_EXEC = "EXEC";

    public static String RELATIONSHIP_WBS = "WBS";
    public static String RELATIONSHIP_MEMBER = "MEMBER";
    public static String RELATIONSHIP_ISSUE = "ISSUE";
    public static String RELATIONSHIP_ISSUE_MANAGER = "ISSUE_MANAGER";
    public static String RELATIONSHIP_ISSUE_ECO = "ISSUE_ECO";
    public static String RELATIONSHIP_BASELINE = "BASELINE";
    public static String RELATIONSHIP_GATEVIEW_METTING = "METTING";
    public static String RELATIONSHIP_GATEVIEW_CHECKLIST = "CHECKLIST";
    public static String RELATIONSHIP_DOC_CLASS = "DOC_CLASS";
    public static String RELATIONSHIP_DOC_MASTER = "DOC_MASTER";
    public static String RELATIONSHIP_PROJECT_EPART = "PROJECT_EPART";
    public static String RELATIONSHIP_EPART = "EPART";
    public static String RELATIONSHIP_DOCUMENT = "DOCUMENT";

    public static String ROLE_CFT = "CFT";
    public static String ROLE_PM = "PM";
    public static String ROLE_PE = "PE";
    public static String ROLE_GUEST = "GUEST";

    public static String TABLE_PROJECT = "T_DPMS_PROJECT";
    public static String TABLE_PROCESS = "T_DPMS_PROCESS";
    public static String TABLE_ISSUE = "T_DPMS_ISSUE";
    public static String TABLE_RELIABILITY = "T_DPMS_RELIABILITY_FROM";
    public static String TABLE_RELIABILITY_REPORT = "T_DPMS_RELIABILITY_REPORT";
    public static String TABLE_EPL = "T_DPMS_EPL";
    public static String TABLE_EPL_ITEM = "T_DPMS_EPL_ITEM";

    public static String TABLE_CHECKLIST = "T_DPMS_CHECKLIST";

    public static int PROJECT_ROLE_PM = 1;

    public static int OPEN_ISSUE_ROLE_MANAGER = 27; //담당자
    public static int OPEN_ISSUE_ROLE_ADMIN = 30; //담당자

    // 기본기간
    public static int INIT_DURATION = 1;
    public static int INIT_COMPLETE = 0;

    public static int PREPARE = 5;
    public static int DELAY = 1;
    public static String WARNING_COLOR = "#00f";
    public static String DELAY_COLOR = "#f00";

    // 상태
    public static String POLICY_PROJECT_PREPARE = "Prepare";
    public static String POLICY_PROJECT_STARTED = "Started";
    public static String POLICY_PROJECT_PAUSED = "Paused";
    public static String POLICY_PROJECT_COMPLETED = "Completed";
    public static String POLICY_PROJECT_DISPOSAL = "Disposal";

    public static String POLICY_PROJECT_TEMP_EXIST = "Exist";
    public static String POLICY_PROJECT_TEMP_DISPOSAL = "Disposal";

    public static String POLICY_PROCESS_PREPARE = "Prepare";
    public static String POLICY_PROCESS_STARTED = "Started";
    public static String POLICY_PROCESS_PAUSED = "Paused";
    public static String POLICY_PROCESS_COMPLETED = "Completed";
    public static String POLICY_PROCESS_COMPLETED_KOR = "완료됨";
    public static String POLICY_PROCESS_PAUSED_KOR = "일시중지";

    public static int PROCESS_PERCENTAGE_COMPLETED = 100;

    public static String POLICY_ISSUE_PREPARE = "Prepare";
    public static String POLICY_ISSUE_BEFORE_STARTED = "BeforeStarted";
    public static String POLICY_ISSUE_STARTED = "Started";
    public static String POLICY_ISSUE_BEFORE_COMPLETED = "BeforeCompleted";
    public static String POLICY_ISSUE_REJECT = "Reject";
    public static String POLICY_ISSUE_COMPLETED = "Completed";

    public static String POLICY_EPL_PREPARE = "Prepare";
    public static String POLICY_EPL_REVIEW = "Review";
    public static String POLICY_EPL_COMPLETED = "Completed";

    // ACTION
    public static String ACTION_NEW = "N";
    public static String ACTION_ADD = "A";
    public static String ACTION_ADD_NM = "ADD";
    public static String ACTION_UPDATE = "U";
    public static String ACTION_DELETE = "D";
    public static String ACTION_DELETE_NM = "DEL";
    public static String ACTION_LEFT = "L";
    public static String ACTION_RIGHT = "R";
    public static String ACTION_NONE = "NONE";
    public static String ACTION_MODIFY = "MODIFY";

    // SKIP
    public static int TASK_SKIPPED = 1;
    public static int TASK_NOT_SKIPPED = 0; // OR NULL
    public static String PROCESS_STATUS_SKIP = "SKIP";

    // Option
    public static List<String> DISEDITABLE;
    public static List<String> FLOWEDITABLE;
    public static List<String> PFLOWEDITABLE;

    public static List<String> getDISEDITABLE() {
        List<String> result = new ArrayList<>();
        result.add("ObjName");
        result.add("Dependency");
        result.add("EstEndDt");
        result.add("EstDuration");
        return DISEDITABLE;
    }

    public static List<String> getFLOWEDITABLE() {
        List<String> result = new ArrayList<>();
        result.add("ObjName");
        result.add("Dependency");
        result.add("EstStartDt");
        result.add("EstEndDt");
        result.add("EstDuration");
        result.add("Description");
        return FLOWEDITABLE;
    }

    public static List<String> getPFLOWEDITABLE() {
        List<String> result = new ArrayList<>();
        result.add("Dependency");
        result.add("EstStartDt");
        result.add("EstEndDt");
        result.add("EstDuration");
        result.add("Description");
        return PFLOWEDITABLE;
    }

    // ICON
    public static int DEFAULT_ICONSIZE = 20;
    public static String ICON_CARTYPE = "./images/cartype.png";


    public static Map<Integer, String> AccountCost = new HashMap<>();
    static {
        AccountCost.put(3, "MaterialCost");     //재료비
        AccountCost.put(4, "EMaterialCost");    //기구재료비
        AccountCost.put(5, "CMaterialCost");    //회로재료비
        AccountCost.put(6, "ProcessingCost");   //가공비
        AccountCost.put(7, "LaborCost");        //노무비
        AccountCost.put(8, "DLaborCost");       //직접노무비
        AccountCost.put(9, "ILaborCost");       //간접노무비
        // AccountCost.put(10, "OutSourcing");     //사내외주
        AccountCost.put(11, "Expenses");        //경비
        AccountCost.put(12, "EAmortization");   //설비상각비
        AccountCost.put(13, "MAmortization");   //금형상각비
        AccountCost.put(14, "Etc");             //기타
        // AccountCost.put(15, "MaterialManagementCost"); //재료관리비
        AccountCost.put(16, "TotalCost");        //제조원가 계
    }
    

    public static Map<Integer, String> ProgramCost = new HashMap<Integer,String>();
    static{
        ProgramCost.put(3, "Order.Amount");
        ProgramCost.put(4, "Order.Ratio");
        ProgramCost.put(5, "G1.Amount");
        ProgramCost.put(6, "G1.Ratio");
        ProgramCost.put(7, "G2.Amount");
        ProgramCost.put(8, "G2.Ratio");
        ProgramCost.put(9, "G3.Amount");
        ProgramCost.put(10, "G3.Ratio");
        ProgramCost.put(11, "G4.Amount");
        ProgramCost.put(12, "G4.Ratio");
        ProgramCost.put(13, "G5.Amount");
        ProgramCost.put(14, "G5.Ratio");
        ProgramCost.put(15, "G6.Amount");
        ProgramCost.put(16, "G6.Ratio");
        ProgramCost.put(17, "Description");
    };
   

    public static int STARTANDCOST_PTC = 73;
    public static int STARTANDCOST_ACTUATOR = 75;
    public static int STARTANDCOST_CONTROL = 77;
    public static int STARTANDCOST_CLUTCH_COIL = 76;
    public static int STARTANDCOST_SENSOR = 76;



}
