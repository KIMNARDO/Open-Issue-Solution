package com.papsnet.openissue.biz.project.service;

import com.papsnet.openissue.biz.project.dao.PmsDAO;
import com.papsnet.openissue.biz.project.dto.PmsReliability;
import com.papsnet.openissue.biz.project.dto.PmsReliabilityReport;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PmsReliabilityService {
    private final PmsDAO pmsDAO;

    public List<PmsReliability> selPmsReliability(PmsReliability param) {
        List<PmsReliability> list = pmsDAO.selPmsReliability(param);
        return list == null ? Collections.emptyList() : list;
    }

    public PmsReliability selPmsReliabilityObject(PmsReliability param) {
        return pmsDAO.selPmsReliabilityObject(param);
    }

    public Integer insPmsReliability(PmsReliability param) {
        return pmsDAO.insPmsReliability(param);
    }

    public Integer udtPmsReliability(PmsReliability param) {
        return pmsDAO.udtPmsReliability(param);
    }

    public List<PmsReliabilityReport> selPmsReliabilityReport(PmsReliabilityReport param) {
        List<PmsReliabilityReport> list = pmsDAO.selPmsReliabilityReport(param);
        return list == null ? Collections.emptyList() : list;
    }

    public PmsReliabilityReport selPmsReliabilityReportObject(PmsReliabilityReport param) {
        return pmsDAO.selPmsReliabilityReportObject(param);
    }

    public Integer insPmsReliabilityReport(PmsReliabilityReport param) {
        return pmsDAO.insPmsReliabilityReport(param);
    }

    public Integer udtPmsReliabilityReport(PmsReliabilityReport param) {
        return pmsDAO.udtPmsReliabilityReport(param);
    }
}
