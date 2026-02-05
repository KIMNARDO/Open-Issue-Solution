package com.papsnet.openissue.common.constant;

import java.util.ArrayList;
import java.util.List;

public class EBomConstant {
    public static String TYPE_PART = "PART";
    public static String TYPE_EPLITEM = "EPLITEM";
    public static String TABLE_PART = "T_DEPART";
    
    public static String PART_TYPE = "EPARTTYPE";
    public static String PART_TYPE_ASSY = "Assy";
    public static String PART_TYPE_SASSY = "S";
    public static String PART_TYPE_DETAIL = "D";
    
    public static String DIV_ASSEMBLY = "ASSEMBLY";
    public static String DIV_SINGLE = "SINGLE";
    public static String DIV_STANDARD= "STANDARD";
    public static String DIV_EDEVICE = "EDEVICE";
    
    public static String DIV_ASSEMBLY_NM = "조립도";
    public static String DIV_SINGLE_NM = "단품도";
    public static String DIV_STANDARD_NM = "스탠다드";
    public static String DIV_EDEVICE_NM = "전자소자";
    
    public static String SEARCH_EPART_RELEASE = "RELEASE";
    public static String SEARCH_EPART_WRITE = "WRITE";
    
    public static String POLICY_EPART_PREPARE = "Prepare";
    public static String POLICY_EPART_REVIEW = "Review"; //결재중
    public static String POLICY_EPART_REJECT = "Reject"; //반려
    public static String POLICY_EPART_COMPLETED = "Completed";
    
    public static String PARTDIVASSY = "10";
    public static String PARTDIVSASSY = "20";
    public static String PARTDIVDETAIL = "30";
    
    public static String PARTDIVASSY_NM = "제품";
    public static String PARTDIVSASSY_NM = "반제품";
    public static String PARTDIVDETAIL_NM = "원자재";
    
    public static List<String> DISEDITABLE;
    public static List<String> FLOWEDITABLE;
    public static List<String> getDISEDITABLE() {
        List<String> result = new ArrayList<>();
        result.add("OID");
        result.add("FromOID");
        result.add("ToOID");
        result.add("Level");
        result.add("ObjName");
        result.add("ObjEPartType");
        result.add("ObjThumbnail");
        result.add("ObjOem_Lib_OID");
        result.add("ObjCar_Lib_OID");
        result.add("ObjPms_OID");
        result.add("ObjOem_Lib_NM");
        result.add("ObjCar_Lib_NM");
        result.add("ObjPms_NM");
        result.add("Ord");
        result.add("Count");
        return result;
    }
    public static List<String> getFLOWEDITABLE() {
        List<String> result = new ArrayList<>();
        result.add("OID");
        result.add("FromOID");
        result.add("ToOID");
        result.add("Level");
        result.add("ObjTitle");
        result.add("ObjEPartType");
        result.add("ObjThumbnail");
        result.add("ObjOem_Lib_OID");
        result.add("ObjCar_Lib_OID");
        result.add("ObjPms_OID");
        result.add("ObjOem_Lib_NM");
        result.add("ObjCar_Lib_NM");
        result.add("ObjPms_NM");
        return result;
    }
    
    

}
