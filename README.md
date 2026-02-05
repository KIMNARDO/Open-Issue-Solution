# Open Issue Solution

Woory PLM 시스템에서 분리된 Open Issue 관리 솔루션입니다.

## 프로젝트 구조

```
Open-Issue-Solution/
├── open-issue-web/     # Frontend (React + Vite + TypeScript)
├── open-issue-api/     # Backend (Spring Boot 3.1.2 + MyBatis)
└── README.md
```

## 기술 스택

### Frontend (open-issue-web)
- React 18
- Vite
- TypeScript
- Material-UI (MUI)
- AG Grid Enterprise
- Formik
- SWR

### Backend (open-issue-api)
- Java 17
- Spring Boot 3.1.2
- MyBatis
- SQL Server
- JWT Authentication

## 실행 방법

### Frontend
```bash
cd open-issue-web
pnpm install
pnpm dev
# http://localhost:3008
```

### Backend
```bash
cd open-issue-api
./gradlew bootRun -Pprofile=local
# http://localhost:8080
```

## 환경 설정

### Frontend (.env.local)
```env
VITE_APP_VERSION=v1.0.0
VITE_APP_API_URL=http://localhost:8080
VITE_APP_BASE_NAME=
```

### Backend (application.yml)
`src/main/resources-env/local/application.yml` 파일에서 데이터베이스 연결 정보를 설정하세요.

## 주요 기능

- Open Issue 목록 조회 (부서별/개발팀별)
- Issue 생성/수정/삭제
- Issue 카테고리 관리
- 파일 첨부
- 댓글 기능
- 권한 관리

## 문서

- [Figma Design System](./open-issue-web/FIGMA_DESIGN_SYSTEM.md)
- [Figma Code Reference](./open-issue-web/FIGMA_CODE_REFERENCE.md)

---

*Last Updated: 2026-02-05*
