package com.papsnet.openissue.biz.project.dto;

import com.papsnet.openissue.common.dto.DObject;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.lang.Nullable;

/**
 * DTO for T_DPMS_EPL_SPEC
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
@SuperBuilder
public class PmsEPLSpec extends DObject {
    @Nullable
    private Integer eplOID;

    // Options, Estimators, Parts (20 ~ 49)
    private String option20;    private String estimator20;    private String part20;
    private String option21;    private String estimator21;    private String part21;
    private String option22;    private String estimator22;    private String part22;
    private String option23;    private String estimator23;    private String part23;
    private String option24;    private String estimator24;    private String part24;
    private String option25;    private String estimator25;    private String part25;
    private String option26;    private String estimator26;    private String part26;
    private String option27;    private String estimator27;    private String part27;
    private String option28;    private String estimator28;    private String part28;
    private String option29;    private String estimator29;    private String part29;
    private String option30;    private String estimator30;    private String part30;
    private String option31;    private String estimator31;    private String part31;
    private String option32;    private String estimator32;    private String part32;
    private String option33;    private String estimator33;    private String part33;
    private String option34;    private String estimator34;    private String part34;
    private String option35;    private String estimator35;    private String part35;
    private String option36;    private String estimator36;    private String part36;
    private String option37;    private String estimator37;    private String part37;
    private String option38;    private String estimator38;    private String part38;
    private String option39;    private String estimator39;    private String part39;
    private String option40;    private String estimator40;    private String part40;
    private String option41;    private String estimator41;    private String part41;
    private String option42;    private String estimator42;    private String part42;
    private String option43;    private String estimator43;    private String part43;
    private String option44;    private String estimator44;    private String part44;
    private String option45;    private String estimator45;    private String part45;
    private String option46;    private String estimator46;    private String part46;
    private String option47;    private String estimator47;    private String part47;
    private String option48;    private String estimator48;    private String part48;
    private String option49;    private String estimator49;    private String part49;

    // Selected parts (20 ~ 49)
    private String selPart20;   private String selPart21;   private String selPart22;   private String selPart23;   private String selPart24;
    private String selPart25;   private String selPart26;   private String selPart27;   private String selPart28;   private String selPart29;
    private String selPart30;   private String selPart31;   private String selPart32;   private String selPart33;   private String selPart34;
    private String selPart35;   private String selPart36;   private String selPart37;   private String selPart38;   private String selPart39;
    private String selPart40;   private String selPart41;   private String selPart42;   private String selPart43;   private String selPart44;
    private String selPart45;   private String selPart46;   private String selPart47;   private String selPart48;   private String selPart49;

    // Standards (20 ~ 49)
    private String standard20;  private String standard21;  private String standard22;  private String standard23;  private String standard24;
    private String standard25;  private String standard26;  private String standard27;  private String standard28;  private String standard29;
    private String standard30;  private String standard31;  private String standard32;  private String standard33;  private String standard34;
    private String standard35;  private String standard36;  private String standard37;  private String standard38;  private String standard39;
    private String standard40;  private String standard41;  private String standard42;  private String standard43;  private String standard44;
    private String standard45;  private String standard46;  private String standard47;  private String standard48;  private String standard49;
}
