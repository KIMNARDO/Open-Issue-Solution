package com.papsnet.openissue.biz.salesOrder.dao;

import com.papsnet.openissue.biz.salesOrder.dto.SalesOrder;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SalesOrderDAO {
    List<SalesOrder> selSalesOrders(SalesOrder cond) throws Exception;
    SalesOrder selSalesOrderByKey(SalesOrder cond) throws Exception;

    // 추가: PM 업데이트, 비고/대표값 업데이트
    int udtSalesOrderPM(SalesOrder param) throws Exception;
    int udtRemarkAndRep(SalesOrder param) throws Exception;

    // 추가: PLM 수주 업데이트/등록/조회
    int udtPlmSalesOrder(SalesOrder param) throws Exception;
    int udtPlmTemplateSalesOrder(SalesOrder param) throws Exception;
    int insPlmSalesOrder(SalesOrder param) throws Exception;
    SalesOrder selPlmSalesOrder(SalesOrder cond) throws Exception;

    // 추가: Rep 설정 업데이트 (T_DSALESORDER.Rep)
    int udtRepStting(SalesOrder param) throws Exception;
}
