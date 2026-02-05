package com.papsnet.openissue.biz.salesOrder.service;

import com.papsnet.openissue.biz.project.dto.PmsProject;
import com.papsnet.openissue.biz.salesOrder.dao.SalesOrderDAO;
import com.papsnet.openissue.biz.salesOrder.dto.SalesOrder;
import com.papsnet.openissue.common.constant.CommonConstant;
import com.papsnet.openissue.common.constant.SalesOrderConstant;
import com.papsnet.openissue.common.dto.BPolicy;
import com.papsnet.openissue.common.dto.DObject;
import com.papsnet.openissue.common.service.BPolicyService;
import com.papsnet.openissue.common.service.DObjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class SalesOrderService {

    private final SalesOrderDAO salesOrderDAO;
    private final BPolicyService bpolicyService;
    private final DObjectService dObjectService;

    public List<SalesOrder> findSalesOrders(SalesOrder cond) {
        try {
            List<SalesOrder> orders = salesOrderDAO.selSalesOrders(cond);
            if (orders == null || orders.isEmpty()) {
                return Collections.emptyList();
            }

            // C#의 FindAll + Select와 동일: IF_GB == DELETE 인 것들의 OB_NO 집합
            Set<String> deleteObNos = orders.stream()
                    .filter(o -> CommonConstant.IF_GB_DELETE.equals(o.getIfGb()))
                    .map(SalesOrder::getObNo)     // null 도 그대로 포함 (C#과 동일 동작)
                    .collect(Collectors.toSet());

            // C#의 Where(!Contains(...))와 동일: 삭제 대상 OB_NO 가진 항목 전부 제외
            return orders.stream()
                    .filter(o -> !deleteObNos.contains(o.getObNo()))
                    .collect(Collectors.toList());

        } catch (Exception e) {
            log.error("수주 목록 조회 중 오류 발생", e);
            return List.of();
        }
    }

    public SalesOrder findSalesOrder(SalesOrder cond) {
        try {
            return salesOrderDAO.selSalesOrderByKey(cond);
        } catch (Exception e) {
            log.error("수주 단건 조회 중 오류 발생", e);
            return null;
        }
    }

    // PM 업데이트
    public int updateSalesOrderProjectManager(SalesOrder param) {
        try {
            return salesOrderDAO.udtSalesOrderPM(param);
        } catch (Exception e) {
            log.error("PM 업데이트 중 오류 발생", e);
            return -1;
        }
    }

    // 비고 및 대표값 업데이트
    public int updateRemarkAndRep(SalesOrder param) {
        try {
            return salesOrderDAO.udtRemarkAndRep(param);
        } catch (Exception e) {
            log.error("비고/대표값 업데이트 중 오류 발생", e);
            return -1;
        }
    }

    // PLM 수주 업데이트 (템플릿 포함 여부에 따라 분기)
    public int updatePlmSalesOrder(SalesOrder param) {
        try {
            if (param.getTemplateOid() != null) {
                return salesOrderDAO.udtPlmTemplateSalesOrder(param);
            }
            return salesOrderDAO.udtPlmSalesOrder(param);
        } catch (Exception e) {
            log.error("PLM 수주 업데이트 중 오류 발생", e);
            return -1;
        }
    }

    // PLM 수주 등록
    public int insertPlmSalesOrder(SalesOrder param) {
        try {
            return salesOrderDAO.insPlmSalesOrder(param);
        } catch (Exception e) {
            log.error("PLM 수주 등록 중 오류 발생", e);
            return -1;
        }
    }

    // PLM 수주 단건 조회
    public SalesOrder findPlmSalesOrder(SalesOrder cond) {
        try {
            return salesOrderDAO.selPlmSalesOrder(cond);
        } catch (Exception e) {
            log.error("PLM 수주 단건 조회 중 오류 발생", e);
            return null;
        }
    }

    // Rep 설정 업데이트 (T_DSALESORDER.Rep)
    public int updateRepSetting(SalesOrder param) {
        try {
            return salesOrderDAO.udtRepStting(param);
        } catch (Exception e) {
            log.error("Rep 설정 업데이트 중 오류 발생", e);
            return -1;
        }
    }

    // 수주 일시중지: DObject의 BPolicyOID를 'Paused' 정책으로 변경
    @Transactional
    public int pauseSalesOrder(PmsProject param) {
        try {
            if (param == null || param.getOid() == null || param.getOid() <= 0) {
                return 0;
            }
            List<BPolicy> policies = bpolicyService.selBPolicys(new BPolicy(SalesOrderConstant.TYPE_SALESORDER, null));
            if (policies == null || policies.isEmpty()) {
                log.error("BPolicy not found for type: {}", SalesOrderConstant.TYPE_SALESORDER);
                return 0;
            }
            Integer pausedPolicyOid = policies.stream()
                    .filter(p -> SalesOrderConstant.POLICY_SALESORDER_PAUSED.equals(p.getName()))
                    .map(BPolicy::getOid)
                    .findFirst()
                    .orElse(null);
            if (pausedPolicyOid == null) {
                log.error("Paused policy not found in BPolicy list for type: {}", SalesOrderConstant.TYPE_SALESORDER);
                return 0;
            }
            DObject d = DObject.builder()
                    .oid(param.getOid())
                    .bpolicyOID(pausedPolicyOid)
                    .build();
            return dObjectService.udtDObject(d);
        } catch (Exception e) {
            log.error("수주 일시중지 처리 중 오류 발생", e);
            throw e;
        }
    }
}
