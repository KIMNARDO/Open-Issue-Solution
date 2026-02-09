import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import { RouteObject } from 'react-router';
import { Typography, Box } from '@mui/material';

// Error pages
const MaintenanceError500 = Loadable(lazy(() => import('pages/maintenance/500')));
const MaintenanceError404 = Loadable(lazy(() => import('pages/maintenance/404')));

// Dashboard
const Dashboard = Loadable(lazy(() => import('pages/dashboard/Dashboard')));

// Open Issue - Main Feature (실제 존재하는 페이지)
const OpenIssue = Loadable(lazy(() => import('pages/qms/qms/open-issue')));

// System pages (실제 존재하는 페이지)
const UserManage = Loadable(lazy(() => import('pages/system/user-manage')));
const AuthManage = Loadable(lazy(() => import('pages/system/auth-manage')));
const LibraryManage = Loadable(lazy(() => import('pages/system/library-manage')));
const CodeLibraryManage = Loadable(lazy(() => import('pages/system/code-library-manage')));
const AssessLibraryManage = Loadable(lazy(() => import('pages/system/assess-library-manage')));
const Calendar = Loadable(lazy(() => import('pages/system/calendar')));

// Placeholder component for pages under development
const PlaceholderPage = ({ title }: { title: string }) => (
  <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
    <Typography variant="h4" color="text.secondary">{title} (개발 중)</Typography>
  </Box>
);

// ==============================|| MAIN ROUTING - OPEN ISSUE ||============================== //

const MainRoutes: RouteObject = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        // QMS - Open Issue (핵심 기능)
        {
          path: 'Qms/OpenIssueList',
          element: <OpenIssue />
        },
        {
          path: 'Qms/QuickResponseList',
          element: <PlaceholderPage title="신속대응현황" />
        },
        // System Management
        {
          path: 'Manage/UserManage',
          element: <UserManage />
        },
        {
          path: 'Manage/AuthManage',
          element: <AuthManage />
        },
        {
          path: 'Manage/LibraryManage',
          element: <LibraryManage />
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
          path: 'Manage/CalendarManage',
          element: <Calendar />
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
