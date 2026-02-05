import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import { RouteObject } from 'react-router';
import { Typography, Box } from '@mui/material';

const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceError404 = Loadable(lazy(() => import('pages/maintenance/404')));

// const Dashboard = Loadable(lazy(() => import('pages/dashboard/Dashboard')));
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
const ProjectDetail = Loadable(lazy(() => import('pages/project/detail')));
// const BbsManage = Loadable(lazy(() => import('pages/system/bbs')));
const DocumentRegist = Loadable(lazy(() => import('pages/document/regist')));
const DocClass = Loadable(lazy(() => import('pages/doc-class/search')));
const DocClassDetail = Loadable(lazy(() => import('pages/doc-class/detail')));
const DocumentSearch = Loadable(lazy(() => import('pages/document/search')));
const DocumentDetail = Loadable(lazy(() => import('pages/document/detail')));

const EbomManage = Loadable(lazy(() => import('pages/ebom')));
const EbomRegist = Loadable(lazy(() => import('pages/ebom/regist')));
const EbomDetail = Loadable(lazy(() => import('pages/ebom/detail')));

const EcrSearch = Loadable(lazy(() => import('pages/ecr/search')));
const EcrRegist = Loadable(lazy(() => import('pages/ecr/regist')));
const EcoSearch = Loadable(lazy(() => import('pages/eco/search')));
const EcoRegist = Loadable(lazy(() => import('pages/eco/regist')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes: RouteObject = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          // 라우트 오류 방지용
          path: 'dashboard',
          element: <></>
        },
        // SalesOrder
        {
          path: 'SalesOrder/SearchSalesOrder',
          element: <SalesOrderProject />
        },
        // Pms
        {
          path: 'Pms/InfoMyTask',
          element: <MyTask />
        },
        {
          path: 'Pms/SearchProject',
          element: <DevProject />
        },
        {
          path: 'Pms/detail/:oid',
          element: <ProjectDetail />
        },
        {
          path: 'Pms/SearchTemplateProject',
          element: <ProjectTemplate />
        },
        {
          path: 'Pms/ResourceDashboard',
          element: <></>
        },
        {
          path: 'Pms/TotalProjMngt',
          element: <></>
        },
        {
          path: 'Pms/CustomerScheduleTemplate',
          element: <></>
        },
        {
          path: 'Pms/PmDashboard',
          element: (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">PM 대시보드</Typography>
            </Box>
          )
        },
        {
          path: 'Pms/PersonDashboard',
          element: (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">개인 대시보드</Typography>
            </Box>
          )
        },
        {
          path: 'Pms/CLevelDashboard',
          element: (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">임원 대시보드</Typography>
            </Box>
          )
        },
        {
          path: 'Pms/ExecDashboard',
          element: (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">팀장 대시보드</Typography>
            </Box>
          )
        },
        {
          path: 'Pms/BIDashboard',
          element: (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">개발현황</Typography>
            </Box>
          )
        },
        // EBom
        {
          path: 'EBom',
          children: [
            {
              path: 'SearchReleaseEPart',
              element: <EbomManage />
            },
            {
              path: 'SearchEPart',
              element: <EbomManage />
            },
            {
              path: 'CompareEPart',
              element: (
                <Box sx={{ p: 3 }}>
                  <Typography variant="h4">E-BOM Compare</Typography>
                </Box>
              )
            },
            {
              path: 'CreateEPart',
              element: <EbomRegist />
            },
            {
              path: ':oid',
              element: <EbomDetail />
            }
          ]
        },

        // ChangeOrder
        {
          path: 'ChangeOrder/SearchReleaseChangeOrder',
          element: <EcoSearch />
        },
        {
          path: 'ChangeOrder/CreateChangeOrder',
          element: <EcoRegist />
        },
        {
          path: 'ChangeOrder/SearchChangeOrder',
          element: <EcoSearch />
        },
        // ChangeRequest
        {
          path: 'ChangeRequest/SearchReleaseChangeRequest',
          element: <EcrSearch />
        },
        {
          path: 'ChangeRequest/CreateChangeRequest',
          element: <EcrRegist />
        },
        {
          path: 'ChangeRequest/SearchChangeRequest',
          element: <EcrSearch />
        },
        // Document
        {
          path: 'Document',
          children: [
            {
              path: 'SearchReleaseDocument',
              element: <DocumentSearch />
            },
            {
              path: 'CreateDocument',
              element: <DocumentRegist />
            },
            {
              path: 'SearchDocument',
              element: <DocumentSearch />
            },
            {
              path: ':oid',
              element: <DocumentDetail />
            }
          ]
        },
        // Econtents
        {
          path: 'Econtents/SearchReleaseProblemsLibrary',
          element: (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">과거차 문제 라이브러리 관리</Typography>
            </Box>
          )
        },
        {
          path: 'Econtents/SearchProblemsLibrary',
          element: (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">과거차 문제 라이브러리 등록</Typography>
            </Box>
          )
        },
        // Manage
        {
          path: 'Manage/CalendarManage',
          element: <Calendar />
        },
        {
          path: 'Manage/UserManage',
          element: <UserManage />
        },
        {
          path: 'Manage/LibraryManage',
          element: <LibraryManage />
        },
        {
          path: 'Manage/AuthManage',
          element: <AuthManage />
        },
        {
          path: 'Manage/CodeLibrary',
          element: <CodeLibraryManage />
        },
        {
          path: 'Manage/AssessListLibrary',
          element: <AssessLibraryManage />
        },
        {
          path: 'Manage/DocumentClassification',
          element: <DocClass />
        },
        {
          path: 'Manage/DocumentClassification/:oid',
          element: <DocClassDetail />
        },
        {
          path: 'Manage/BiUrlManage',
          element: (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">BI URL 관리</Typography>
            </Box>
          )
        },
        // Common
        {
          path: 'Common/MyApproval',
          element: <Approval />
        },
        // Qms
        {
          path: 'Qms/QuickResponseList',
          element: (
            <Box sx={{ p: 3 }}>
              <Typography variant="h4">신속대응현황</Typography>
            </Box>
          )
        },
        {
          path: 'Qms/OpenIssueList',
          element: <OpenIssue />
        }
      ]
    },
    {
      path: '*',
      element: <MaintenanceError404 />
    }
  ],
  errorElement: <MaintenanceError500 />
};

export default MainRoutes;
