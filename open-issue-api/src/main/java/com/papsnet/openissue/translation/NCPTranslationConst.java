package com.papsnet.openissue.translation;

public class NCPTranslationConst {
    public enum NCPProgressStatus {
        WAITING("대기중"),
        FAILED("실패"),
        PROGRESS("진행중"),
        COMPLETE("완료됨");

        private final String label;
        NCPProgressStatus(String label) {
            this.label = label;
        }
        public String label() {
            return label;
        }
    };
}
