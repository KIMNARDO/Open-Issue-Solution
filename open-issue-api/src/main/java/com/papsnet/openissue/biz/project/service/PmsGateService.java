package com.papsnet.openissue.biz.project.service;

import com.papsnet.openissue.biz.project.dao.PmsDAO;
import com.papsnet.openissue.biz.project.dto.PmsGateMetting;
import com.papsnet.openissue.biz.project.dto.PmsGateSignOff;
import com.papsnet.openissue.biz.project.dto.PmsGateSignOffCost;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PmsGateService {
    private final PmsDAO pmsDAO;

    public List<PmsGateMetting> selPmsGateMetting(PmsGateMetting param) {
        List<PmsGateMetting> l = pmsDAO.selPmsGateMetting(param);
        return l == null ? Collections.emptyList() : l;
    }

    public PmsGateMetting selPmsGateMettingObject(PmsGateMetting param) {
        return pmsDAO.selPmsGateMettingObject(param);
    }

    public PmsGateSignOff selPmsGateSignOff(PmsGateSignOff param) {
        return pmsDAO.selPmsGateSignOff(param);
    }

    public PmsGateSignOff udtPmsGateSignOff(PmsGateSignOff param) {
        pmsDAO.udtPmsGateSignOff(param);
        return param;
    }

    public Integer insPmsGateSignOffCost(PmsGateSignOffCost param) {
        return pmsDAO.insPmsGateSignOffCost(param);
    }
    public List<PmsGateSignOffCost> selPmsGateSignOffCost(PmsGateSignOffCost param) {
        List<PmsGateSignOffCost> l = pmsDAO.selPmsGateSignOffCost(param);
        return l == null ? Collections.emptyList() : l;
    }
    public PmsGateSignOffCost selPmsGateSignOffCostObject(PmsGateSignOffCost param) {
        return pmsDAO.selPmsGateSignOffCostObject(param);
    }
    public Integer delPmsGateSignOffCost(PmsGateSignOffCost param) {
        return pmsDAO.delPmsGateSignOffCost(param);
    }
}
