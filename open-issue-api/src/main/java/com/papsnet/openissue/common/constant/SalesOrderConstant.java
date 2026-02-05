package com.papsnet.openissue.common.constant;

import java.util.HashMap;
import java.util.Map;

public class SalesOrderConstant {
    public static String TYPE_SALESORDER = "SALESORDER";
    public static String TYPE_SALESDELIVERIES = "SALES_DELIVERIES";
    public static String TYPE_SALESMASTER = "SALESMASTER";
    
    public static String TYPE_SALESPHASE = "SALESPHASE";
    public static String TYPE_SALESTASK = "SALESTASK";
    public static String TYPE_PSALESITEM = "PSALESITEM";
    public static String TYPE_SALESITEM = "SALESITEM";
    
    public static String TABLE_SALESORDER = "T_DSALESORDER";
    public static String TABLE_SALESCONTENT = "T_DSALES_CONTENT";
    public static String TABLE_SALESPROCESS = "T_DSALES_PROCESS";
    
    public static String RELATIONSHIP_SALES = "SALES";
    
    public static String STATUS_A1 = "A1";
    public static String STATUS_B1 = "B1";
    public static String STATUS_B2 = "B2";
    public static String STATUS_C1 = "C1";
    public static String STATUS_C2 = "C2";
    public static String STATUS_D1 = "D1";
    public static String STATUS_E1 = "E1";
    public static String STATUS_G1 = "G1";
    public static String STATUS_H1 = "H1";
    public static String STATUS_Z1 = "Z1";
    
    public static String STATUS_NM_A1 = "영업";
    public static String STATUS_NM_B1 = "RFQ";
    public static String STATUS_NM_B2 = "RFQ(OPT)";
    public static String STATUS_NM_C1 = "견적";
    public static String STATUS_NM_C2 = "견적(OPT)";
    public static String STATUS_NM_D1 = "개발";
    public static String STATUS_NM_E1 = "양산";
    public static String STATUS_NM_G1 = "A/S";
    public static String STATUS_NM_H1 = "단종";
    public static String STATUS_NM_Z1 = "취소";
    
    public static Map<String, String> StatusDictionary = new HashMap<>();
    static{
        StatusDictionary.put("A1" , "영업");
        StatusDictionary.put("B1" , "RFQ");
        StatusDictionary.put("B2" , "RFQ(OPT)");
        StatusDictionary.put("C1" , "견적");
        StatusDictionary.put("C2" , "견적(OPT)");
        StatusDictionary.put("D1" , "개발");
        StatusDictionary.put("E1" , "양산");
        StatusDictionary.put("G1" , "A/S");
        StatusDictionary.put("H1" , "단종");
        StatusDictionary.put("Z1" , "취소");
    }
    
    public static String RELATIONSHIP_WBS = "WBS";
    public static String RELATIONSHIP_MEMBER = "MEMBER";
    
    //상태
    public static String POLICY_SALESORDER_PREPARE = "Prepare";
    public static String POLICY_SALESORDER_STARTED = "Started";
    public static String POLICY_SALESORDER_PAUSED = "Paused";
    public static String POLICY_SALESORDER_COMPLETED = "Completed";
    public static String POLICY_SALESORDER_DISPOSAL = "Disposal";
    
    public static String POLICY_SALESORDER_TEMP_EXIST = "Exist";
    public static String POLICY_SALESORDER_TEMP_DISPOSAL = "Disposal";
    
    public static String POLICY_PROCESS_PREPARE = "Prepare";
    public static String POLICY_PROCESS_STARTED = "Started";
    public static String POLICY_PROCESS_PAUSED = "Paused";
    public static String POLICY_PROCESS_COMPLETED = "Completed";
    
    public static int ATTRIBUTE_DIVISION_PRODUCT = 10;
    public static int ATTRIBUTE_DIVISION_SEMIPRODUCT = 20;
    public static int ATTRIBUTE_DIVISION_MATERIALS = 30;
    
    public static String ATTRIBUTE_DIVISION_PRODUCT_NM = "제품";
    public static String ATTRIBUTE_DIVISION_SEMIPRODUCT_NM = "반제품";
    public static String ATTRIBUTE_DIVISION_MATERIALS_NM = "원자재";   
}
