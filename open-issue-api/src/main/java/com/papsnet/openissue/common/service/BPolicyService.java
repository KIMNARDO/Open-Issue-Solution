package com.papsnet.openissue.common.service;

import com.papsnet.openissue.common.dao.CommonDAO;
import com.papsnet.openissue.common.dto.BPolicy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class BPolicyService {
    private final CommonDAO commonDAO;

    public List<BPolicy> selBPolicys(BPolicy param) {
        return commonDAO.selBPolicys(param);
    }

    public BPolicy selBPolicy(BPolicy param) {
        return commonDAO.selBPolicy(param);
    }

    public List<BPolicy> selBPolicyOIDs(BPolicy param) {
        return commonDAO.selBPolicys(param);
    }
}
