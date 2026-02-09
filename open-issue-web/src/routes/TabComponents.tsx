import Loadable from 'components/Loadable';
import { lazy } from 'react';

// Open Issue 전용 모드 - 필요한 컴포넌트만 로드
const Dashboard = Loadable(lazy(() => import('pages/dashboard/Dashboard')));
const OpenIssue = Loadable(lazy(() => import('pages/qms/qms/open-issue')));

// Placeholder 컴포넌트 - 개발 모드용
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '20px', textAlign: 'center' }}>
    <h2>{title}</h2>
    <p>This page is not available in Open Issue standalone mode.</p>
  </div>
);

export const TabComponents: Record<string, JSX.Element> = {
  dashboard: <Dashboard />,
  '62': <OpenIssue />, // 오픈이슈
  // Placeholder for other routes that might be referenced
  '38': <PlaceholderPage title="Calendar" />,
  '39': <PlaceholderPage title="User Management" />,
  '41': <PlaceholderPage title="Auth Management" />,
  '40': <PlaceholderPage title="Library Management" />,
  '59': <PlaceholderPage title="Code Library Management" />,
  '60': <PlaceholderPage title="Assess Library Management" />,
  '13': <PlaceholderPage title="E-BOM Search" />,
  '45': <PlaceholderPage title="E-BOM Registration" />,
  '42': <PlaceholderPage title="Approval" />,
  '1': <PlaceholderPage title="My Task" />,
  '2': <PlaceholderPage title="Dev Project" />,
  '52': <PlaceholderPage title="Notice Management" />,
  '27': <PlaceholderPage title="Document Search" />,
  '28': <PlaceholderPage title="Document Registration" />,
  '29': <PlaceholderPage title="Draft/Rejected Documents" />,
  '67': <PlaceholderPage title="Document Classification" />,
  '3': <PlaceholderPage title="Project Template" />,
  '11': <PlaceholderPage title="Sales Order" />,
  '19': <PlaceholderPage title="ECO Search" />,
  '22': <PlaceholderPage title="ECR Search" />,
  '49': <PlaceholderPage title="ECO Registration" />,
  '48': <PlaceholderPage title="ECR Registration" />
};
