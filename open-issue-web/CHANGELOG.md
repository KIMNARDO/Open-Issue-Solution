# Open Issue Web - Change Log

## Version History

### v0.3.1 (2026-02-06) - Data Filtering Fix
**Status**: Completed

**Changes**:
- [x] searchOpenIssue 함수 필터링 로직 수정
  - openIssueType (DEPT/DEV) 필터링
  - openIssueGroup (팀 ID) → openIssueCategoryOid 매핑 필터링
  - openIssueCategoryOid (그룹 ID) → openIssueGroup 매핑 필터링
  - searchWord 검색어 필터링 (description, projectNm, itemNm, oemLibNm, issueNo, issueManagerNm)

**Files Modified**:
- `src/api/qms/open-issue/openIssueService.ts`
  - searchOpenIssue 함수 필터링 로직 개선

---

### v0.3.0 (2026-02-06) - UX Enhancement & Data Expansion
**Status**: Completed

**Changes**:
- [x] Mock 데이터 필드 완성 (category, groupCategory, project, 제품군, 고객사, Issues)
  - 모든 레코드에 category (기타/사양/품질) 할당
  - openIssueGroup, openIssueCategoryOid, groupCategoryOid 필드 추가
  - 비어있던 issueManagerNm, assignedTo 필드 완성
  - description 필드에 상세 이력 추가
- [x] 사이드바 카테고리별 더미 데이터 확장
  - DEPT: 8개 팀 (영업팀, 품질관리팀, 기술팀, 경영기획팀, 구매팀, 생산팀, IT팀, 해외법인)
  - 각 팀별 3~6개 하위 그룹 추가
  - DEV: 7개 제품군 (HV PTC, LV PTC, Coolant Valve, Coolant Heater, Air PTC, Control Unit, Actuator)
  - 각 제품군별 2~8개 프로젝트 추가
- [x] Mock 데이터 40건 이상으로 확장 (기존 32건 → 44건)
  - 해외법인 이슈 3건 추가 (인도/중국/태국 법인)
  - 품질 감사, 설계 변경, 협력업체 평가, 생산성 향상, 시험 평가, PLM 시스템 등 추가
  - DEV 타입 데이터 6건 추가

**Files Modified**:
- `src/api/qms/open-issue/openIssueService.ts`
  - mockMenuData 확장 (DEPT 8개 팀, DEV 7개 제품군)
  - mockOpenIssueData 44건으로 확장 (모든 필드 완성)

---

### v0.2.0 (2026-02-06) - Mock Data Implementation
**Status**: Completed

**Changes**:
- [x] Excel 데이터 기반 Mock 데이터 32건 추가
- [x] ImportanceRenderer 컴포넌트 생성 (Priority 색상 표시)
- [x] 개발 모드 인증 우회 설정 (VITE_DEV_BYPASS_AUTH)
- [x] 사이드바 메뉴 Mock 데이터 추가 (DEPT/DEV 카테고리)
- [x] Dashboard 페이지 생성
- [x] TabComponents 간소화 (Open Issue 전용 모드)

**Files Added**:
- `src/components/cellEditor/ImportanceRenderer.tsx`
- `src/pages/dashboard/Dashboard.tsx`
- `src/pages/dashboard/index.tsx`
- `src/components/tiptap-icons/chevron-down-icon.tsx`

**Files Modified**:
- `src/api/qms/open-issue/openIssueService.ts`
- `src/pages/qms/qms/open-issue/hook/useColumns.ts`
- `src/routes/TabComponents.tsx`
- `package.json`

---

### v0.1.0 (2026-02-05) - Initial Separation
**Status**: Completed

**Changes**:
- [x] Open Issue 기능 메인 PLM에서 분리
- [x] 독립 실행 가능한 프로젝트 구성
- [x] Port 3008 설정

---

## Rollback Instructions

### Rollback to v0.2.0
```bash
# 주요 파일 복원 필요시
git checkout HEAD~1 -- src/api/qms/open-issue/openIssueService.ts
```

### Rollback to v0.1.0
```bash
# 전체 프로젝트 초기화 필요
```
