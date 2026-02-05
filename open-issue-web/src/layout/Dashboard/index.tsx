import { useEffect, useRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Toolbar } from '@mui/material';

// project import
//import Drawer from './Drawer';
//import Header from './Header';
//import Footer from './Footer';
import HorizontalBar from './Drawer/HorizontalBar';
import Loader from 'components/Loader';
//import Breadcrumbs from 'components/@extended/Breadcrumbs';
import AuthGuard from 'utils/route-guard/AuthGuard';

import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/common/menu';

// types
//import { MenuOrientation } from 'types/config';
// import PageStackBar, { STACK_BAR_HEIGHT } from './Drawer/StackBar/PageStackBar';
import { useStackBar } from './Drawer/StackBar/store/useStackBar';
import { throttle } from 'lodash';
// import { MenuOrientation } from 'types/config';
import { TabComponents } from 'routes/TabComponents';
import { componentCache } from './Drawer/StackBar/store/StackBarStoreClass';
import { hasNewVersion } from 'utils/version';
import { confirmation } from 'components/confirm/CommonConfirm';
import { Outlet } from 'react-router';

// ==============================|| MAIN LAYOUT ||============================== //

const DashboardLayout = () => {
  const theme = useTheme();
  const { menuMasterLoading } = useGetMenuMaster();
  const matchDownXL = useMediaQuery(theme.breakpoints.down('xl'));
  // const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { stackbarMenu, activeMenuId, setStackBarMenu, setActiveMenuId } = useStackBar();

  const { miniDrawer } = useConfig();

  // const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // set media wise responsive drawer
  useEffect(() => {
    if (!miniDrawer) {
      handlerDrawerOpen(!matchDownXL);
    }
  }, [matchDownXL]);

  const containerRef = useRef<HTMLDivElement>(null);
  const handleResize = throttle(() => {
    if (containerRef.current) {
      containerRef.current.style.width = `${window.innerWidth}px`;
      containerRef.current.style.height = `${window.innerHeight - 112}px`;
    }
  }, 500);

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    // check tabcomponent
    setStackBarMenu(
      stackbarMenu.filter((menu) => {
        if (TabComponents[menu.id!]) {
          return true;
        } else {
          componentCache.delete(menu.id!);
          return false;
        }
      })
    );

    if (activeMenuId && !TabComponents[activeMenuId] && stackbarMenu.length > 0) {
      setActiveMenuId(stackbarMenu[0].id);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // const TabElements = useMemo(() => {
  //   return getAllElements();
  // }, [stackbarMenu, activeMenuId]);

  useEffect(() => {
    hasNewVersion().then((res) => {
      if (res) {
        confirmation({
          title: '배포',
          msg: '새 버전이 배포되었습니다.',
          buttonProps: {
            cancel: { hideBtn: true }
          }
        });
      }
    });
  }, []);

  if (menuMasterLoading) return <Loader />;

  return (
    <AuthGuard>
      <Box sx={{ display: 'flex', width: '100%', height: '100%', fontSize: theme.typography.body1 }}>
        {/*<Header />*/}
        {/* !isHorizontal ? <Drawer /> : <HorizontalBar />*/}
        <HorizontalBar />
        {/* <PageStackBar /> */}

        <Box
          component="main"
          sx={{
            //mt: STACK_BAR_HEIGHT / 10,
            //width: 'calc(100% - 260px)',
            flexGrow: 1,
            p: 0,
            height: `calc(100vh)`, //${STACK_BAR_HEIGHT / 10}vh)`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Toolbar sx={{ mt: '0px', backgroundColor: '#eee' }} />
          {/* <Toolbar sx={{ mt: isHorizontal ? `${STACK_BAR_HEIGHT}px` : 'inherit' }} /> */}
          {/*<Breadcrumbs sx={{ minHeight: 24 }} />*/}
          {/* {TabElements} */}
          <Outlet />
          {/*<Footer />*/}
        </Box>
      </Box>
    </AuthGuard>
  );
};

export default DashboardLayout;
