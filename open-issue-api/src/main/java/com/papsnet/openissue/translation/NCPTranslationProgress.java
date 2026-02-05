package com.papsnet.openissue.translation;

import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class NCPTranslationProgress {
    private String status;
    private String errCode;
    private String errMsg;
    private Integer progressPercent;
}
