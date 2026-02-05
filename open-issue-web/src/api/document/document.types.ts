import { DObject, PaginationParam } from 'api/common/common.types';

export interface Document extends DObject {
  docType: string;
  docType_KorNm?: string;
  title: string;
  docGroup: string;
  productGroup?: string; // 제품군
  appliedProduct?: string; // 적용 제품
  appliedPartName?: string; // 적용 부품명
  standardType?: string; // 표준 유형
  appliedProject?: string; // 적용 프로젝트
  developmentStage?: string; // 개발 단계
  finalWrittenDate?: string; // 최종 작성일
  analysisTargetName?: string; // 해석 대상
  manufacturer?: string; // 제조사
  systemSupplier?: string; // 시스템 공급업체
  productionYearLot?: string; // >제작 년도 (Lot No.)
  oem?: string; // 완성차 업체
  partNumber?: string; // 부품번호
  analysisPurpose?: string; // 해석 목적
  appliedStage?: string; // 적용 단계
  analysisType?: string; // 해석 유형
  reportFormat?: string; // 보고서 형식
  requestTeam?: string; // 요청 팀
  requester?: string; // 요청자
  analysisExecutor?: string; // 해석 수행처
  documentManagementNo?: string; // 문서 관리 번호
  finalRevisionNo?: string; // 최종 리비전 번호
  customerESNo?: string; // 고객사 ES 번호
  finalEONo?: string; // 최종 EO NO
  finalEOApprovalDate?: string; // 최종 EO 승인일
  customerName?: string; // 고객사명
  standardNumber?: string; // 표준 번호
  distributionDate?: string; // 배포일
  manageUs?: string; // 담당자, 작성자
  manageDt?: string; // 작성일
}

export type DocumentSearch = Partial<Document> & PaginationParam;
