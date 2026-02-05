package com.papsnet.openissue.common.service;

import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.BDefine;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BDefineService {
    private final CommonDAO commonDAO;

    @Transactional(readOnly = true)
    public BDefine selBDefine(BDefine param) {
        if (param == null) return null;
        try {
            return commonDAO.selBDefine(param);
        } catch (Exception e) {
            log.error("BDefineService.selBDefine error: {}", e.getMessage());
            return null;
        }
    }

    @Transactional(readOnly = true)
    public List<BDefine> selBDefines(BDefine param) {
        if (param == null) return Collections.emptyList();
        try {
            return commonDAO.selBDefines(param);
        } catch (Exception e) {
            log.error("BDefineService.selBDefines error: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
