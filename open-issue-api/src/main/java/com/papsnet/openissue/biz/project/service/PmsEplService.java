package com.papsnet.openissue.biz.project.service;

import com.papsnet.openissue.biz.project.dao.PmsDAO;
import com.papsnet.openissue.biz.project.dto.PmsEPL;
import com.papsnet.openissue.biz.project.dto.PmsEPLItem;
import com.papsnet.openissue.biz.project.dto.PmsEPLSpec;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PmsEplService {
    private final PmsDAO pmsDAO;

    public List<PmsEPL> selEPL(PmsEPL param) {
        List<PmsEPL> list = pmsDAO.selEPL(param);
        return list == null ? Collections.emptyList() : list;
    }

    public PmsEPL selEPLObject(PmsEPL param) {
        return pmsDAO.selEPLObject(param);
    }

    public Integer insEPL(PmsEPL param) {
        return pmsDAO.insEPL(param);
    }

    public Integer udtEPL(PmsEPL param) {
        return pmsDAO.udtEPL(param);
    }

    public List<PmsEPLItem> selEPLItem(PmsEPLItem param) {
        List<PmsEPLItem> list = pmsDAO.selEPLItem(param);
        return list == null ? Collections.emptyList() : list;
    }

    public PmsEPLItem selEPLItemObject(PmsEPLItem param) {
        return pmsDAO.selEPLItemObject(param);
    }

    public Integer insEPLItem(PmsEPLItem param) {
        return pmsDAO.insEPLItem(param);
    }

    public Integer udtEPLItem(PmsEPLItem param) {
        return pmsDAO.udtEPLItem(param);
    }

    public Integer delEPLItem(PmsEPLItem param) {
        return pmsDAO.delEPLItem(param);
    }

    public PmsEPLSpec selEPLSpecObject(PmsEPLSpec param) {
        return pmsDAO.selEPLSpecObject(param);
    }

    public Integer insEPLSpec(PmsEPLSpec param) {
        return pmsDAO.insEPLSpec(param);
    }

    public Integer udtEPLSpec(PmsEPLSpec param) {
        return pmsDAO.udtEPLSpec(param);
    }
}
