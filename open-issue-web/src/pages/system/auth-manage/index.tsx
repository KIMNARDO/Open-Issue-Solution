import { Box } from '@mui/material';
import DetailNav, { DetailNavItem } from 'components/list/DetailNav';
import BasicLayout from 'layout/Basic';
import { useState } from 'react';
import MenuAuth from './section/MenuAuth';
import RoleAuth from './section/RoleAuth';

const items: DetailNavItem[] = [
  {
    id: 'menu',
    label: '메뉴'
  },
  {
    id: 'role',
    label: '역할'
  }
];

const ContentRenderer = ({ id }: { id: string }) => {
  switch (id) {
    case 'menu':
      return <MenuAuth />;
    case 'role':
      return <RoleAuth />;
    default:
      return null;
  }
};

const AuthManage = () => {
  const [currentTab, setCurrentTab] = useState('menu');

  return (
    <BasicLayout>
      <Box display="flex" height="100%" gap={2}>
        <Box flex={1} sx={{ border: '1px solid #eee' }}>
          <DetailNav items={items} currentId={currentTab} onItemClick={setCurrentTab} title="권한 관리" />
        </Box>
        <Box flex={6}>
          <ContentRenderer id={currentTab} />
        </Box>
      </Box>
    </BasicLayout>
  );
};

export default AuthManage;
