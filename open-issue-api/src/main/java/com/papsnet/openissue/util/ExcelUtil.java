package com.papsnet.openissue.util;


import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.*;

/**
 * 번역 파이프라인을 위한 간단한 Excel 데이터 유틸리티
 * DB -> Java -> XLSX -> 외부번역 -> XLSX -> Java -> DB 과정에 사용
 */
public class ExcelUtil {

    /**
     * 객체 리스트를 Excel 파일로 내보내기
     *
     * @param data 내보낼 객체 리스트
     * @param <T>  객체 타입
     */
    public static <T> byte[] exportToExcel(List<T> data) throws IOException {
        if (data == null || data.isEmpty()) {
            throw new IllegalArgumentException("데이터가 비어있습니다.");
        }

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Data");

            // 헤더 생성
            createHeader(sheet, data.get(0).getClass());

            // 데이터 행 생성
            for (int i = 0; i < data.size(); i++) {
                createDataRow(sheet, i + 1, data.get(i));
            }

            workbook.write(baos);
            return baos.toByteArray();
        }catch (Exception e) {
            e.printStackTrace();
            return new byte[0];
        }

    }

    /**
     * Excel 파일을 읽어서 객체 리스트로 변환
     *
     * @param <T>   객체 타입
     * @return 변환된 객체 리스트
     */
    public static <T> List<T> importFromExcel(byte[] fileIn, List<T> originDatas) throws IOException {
        List<T> resultList = new ArrayList<>();

        try (ByteArrayInputStream bis = new ByteArrayInputStream(fileIn);
             Workbook workbook = WorkbookFactory.create(bis)) {

            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            // 헤더 행 건너뛰기
            if (rowIterator.hasNext()) {
                rowIterator.next();
            }

            // 부모 클래스 필드까지 포함하여 String 타입 필드만 수집
            List<Field> stringFields = new ArrayList<>();
            Class<?> currentClass = originDatas.get(0).getClass();

            while (currentClass != null && currentClass != Object.class) {
                for (Field field : currentClass.getDeclaredFields()) {
                    if (field.getType() == String.class) {
                        stringFields.add(field);
                    }
                }
                currentClass = currentClass.getSuperclass();
            }

            Iterator<T> dataIterator = originDatas.iterator();
            // 데이터 행 처리
            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                T target = dataIterator.next();
                T obj = createObjectFromRow(row, target, stringFields);
                if (obj != null) {
                    resultList.add(obj);
                }
            }
        }

        return resultList;
    }

    /**
     * 헤더 생성
     */
    private static void createHeader(Sheet sheet, Class<?> clazz) {
        Row headerRow = sheet.createRow(0);

        // 부모 클래스 필드까지 포함하여 String 타입 필드만 수집
        List<Field> stringFields = new ArrayList<>();
        Class<?> currentClass = clazz;

        while (currentClass != null && currentClass != Object.class) {
            for (Field field : currentClass.getDeclaredFields()) {
                if (field.getType() == String.class) {
                    stringFields.add(field);
                }
            }
            currentClass = currentClass.getSuperclass();
        }


        for (int i = 0; i < stringFields.size(); i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(stringFields.get(i).getName());
        }
    }

    /**
     * 데이터 행 생성
     */
    private static <T> void createDataRow(Sheet sheet, int rowNum, T obj) {
        Row row = sheet.createRow(rowNum);

        // 부모 클래스 필드까지 포함하여 String 타입 필드만 수집
        List<Field> stringFields = new ArrayList<>();
        Class<?> currentClass = obj.getClass();

        while (currentClass != null && currentClass != Object.class) {
            for (Field field : currentClass.getDeclaredFields()) {
                if (field.getType() == String.class) {
                    stringFields.add(field);
                }
            }
            currentClass = currentClass.getSuperclass();
        }

        for (int i = 0; i < stringFields.size(); i++) {
            Cell cell = row.createCell(i);
            stringFields.get(i).setAccessible(true);

            try {
                Object value = stringFields.get(i).get(obj);
                setCellValue(cell, value);
            } catch (IllegalAccessException e) {
                cell.setCellValue("");
            }
        }
    }

    /**
     * 행 데이터로부터 객체 생성
     */
    private static <T> T createObjectFromRow(Row row, T data, List<Field> fields) {
        try {
            for (int i = 0; i < fields.size() && i < row.getLastCellNum(); i++) {
                Cell cell = row.getCell(i);
                if (cell != null) {
                    setFieldValue(data, fields.get(i), getCellValue(cell));
                }
            }

            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    /**
     * 셀 값 설정
     */
    private static void setCellValue(Cell cell, Object value) {
        if (value == null) {
            cell.setCellValue("");
        } else if (value instanceof String) {
            cell.setCellValue((String) value);
        } else if (value instanceof Number) {
            cell.setCellValue(((Number) value).doubleValue());
        } else if (value instanceof Boolean) {
            cell.setCellValue((Boolean) value);
        } else {
            cell.setCellValue(value.toString());
        }
    }

    /**
     * 셀 값 읽기
     */
    private static Object getCellValue(Cell cell) {
        return switch (cell.getCellType()) {
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getDateCellValue();
                }
                yield cell.getNumericCellValue();
            }
            case BOOLEAN -> cell.getBooleanCellValue();
            case BLANK -> null;
            default -> cell.getStringCellValue();
        };
    }

    /**
     * 필드 값 설정 (타입별 변환)
     */
    private static void setFieldValue(Object obj, Field field, Object value) throws IllegalAccessException {
        if (value == null) {
            return;
        }
        field.setAccessible(true);
        Class<?> fieldType = field.getType();

        try {
            if (fieldType == String.class) {
                field.set(obj, value.toString());
            } else if (fieldType == Integer.class || fieldType == int.class) {
                field.set(obj, ((Number) value).intValue());
            } else if (fieldType == Long.class || fieldType == long.class) {
                field.set(obj, ((Number) value).longValue());
            } else if (fieldType == Double.class || fieldType == double.class) {
                field.set(obj, ((Number) value).doubleValue());
            } else if (fieldType == Boolean.class || fieldType == boolean.class) {
                field.set(obj, (Boolean) value);
            } else if (fieldType == LocalDateTime.class) {
                if (value instanceof String) {
                    field.set(obj, LocalDateTime.parse((String) value));
                }
            } else {
                field.set(obj, value);
            }
        } catch (Exception e) {
            // 타입 변환 실패시 기본값으로 설정
            if (fieldType == String.class) {
                field.set(obj, "");
            }
        }
    }
}

