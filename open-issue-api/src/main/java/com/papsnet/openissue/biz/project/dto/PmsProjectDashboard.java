package com.papsnet.openissue.biz.project.dto;

import lombok.*;
import org.springframework.lang.Nullable;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PmsProjectDashboard {
        @Nullable
        public Integer OID ;
        public String Name ;
        public Integer Delay ;

        public List<String> Est ;
        public List<String> Act ;

        public String from ;
        public String to ;
        public String label ;
        public String customClass ;
}
