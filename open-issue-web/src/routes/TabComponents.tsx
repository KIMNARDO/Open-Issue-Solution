import Loadable from 'components/Loadable';
import { lazy } from 'react';

const Dashboard = Loadable(lazy(() => import('pages/dashboard/Dashboard')));
const UserManage = Loadable(lazy(() => import('pages/system/user-manage')));
const AuthManage = Loadable(lazy(() => import('pages/system/auth-manage')));
const LibraryManage = Loadable(lazy(() => import('pages/system/library-manage')));
const CodeLibraryManage = Loadable(lazy(() => import('pages/system/code-library-manage')));
const AssessLibraryManage = Loadable(lazy(() => import('pages/system/assess-library-manage')));
// const AppDrawingManage = Loadable(lazy(() => import('pages/app-drw/drawing')));
// const DrawingChange = Loadable(lazy(() => import('pages/app-drw/drawing-change')));
const Approval = Loadable(lazy(() => import('pages/user-task/approval')));
const MyTask = Loadable(lazy(() => import('pages/user-task/my-task')));
const OpenIssue = Loadable(lazy(() => import('pages/qms/open-issue')));
const Calendar = Loadable(lazy(() => import('pages/system/calendar')));
const ProjectTemplate = Loadable(lazy(() => import('pages/project-template')));
const SalesOrderProject = Loadable(lazy(() => import('pages/sales')));
const DevProject = Loadable(lazy(() => import('pages/project/dev')));
const BbsManage = Loadable(lazy(() => import('pages/system/bbs')));
const DocumentRegist = Loadable(lazy(() => import('pages/document/regist')));
const DocClass = Loadable(lazy(() => import('pages/doc-class/search')));
const DocumentSearch = Loadable(lazy(() => import('pages/document/search')));

const EbomManage = Loadable(lazy(() => import('pages/ebom')));
const EbomRegist = Loadable(lazy(() => import('pages/ebom/regist')));

const EcrSearch = Loadable(lazy(() => import('pages/ecr/search')));
const EcrRegist = Loadable(lazy(() => import('pages/ecr/regist')));
const EcoSearch = Loadable(lazy(() => import('pages/eco/search')));
const EcoRegist = Loadable(lazy(() => import('pages/eco/regist')));

export const TabComponents: Record<string, JSX.Element> = {
  dashboard: <Dashboard />,
  '38': <Calendar />, // 캘린더
  '39': <UserManage />, // 사용자 관리
  '41': <AuthManage />, // 권한 관리
  '40': <LibraryManage />, // 라이브러리 관리
  '59': <CodeLibraryManage />, // 코드 라이브러리 관리
  '60': <AssessLibraryManage />, // 영향성 평가 라이브러리 관리
  '13': <EbomManage />, // E-BOM 검색
  '45': <EbomRegist />, // E-BOM 등록
  '62': <OpenIssue />, // 오픈이슈
  '42': <Approval />,
  '1': <MyTask />,
  '2': <DevProject />, // 개발 프로젝트
  '52': <BbsManage />, // 공지사항 관리
  '27': <DocumentSearch />, // 문서 검색
  '28': <DocumentRegist />, // 문서 등록
  '29': <DocumentSearch mode="progress" />, // 작성/반려 문서 검색
  '67': <DocClass />, // 문서분류체계
  '3': <ProjectTemplate />, // 프로젝트 템플릿
  '11': <SalesOrderProject />, // 영업수주
  '19': <EcoSearch />, // ECO 검색
  '22': <EcrSearch />, // ECR 검색
  '49': <EcoRegist />, // ECO 등록
  '48': <EcrRegist /> // ECR 등록
};
