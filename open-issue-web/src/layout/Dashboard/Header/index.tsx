import { ReactNode, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, useMediaQuery, AppBarProps, Tooltip } from '@mui/material';

// project import
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';

import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from 'config';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/common/menu';

// assets
import { faIndent, faOutdent } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// types
import { MenuOrientation } from 'types/config';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  const { menuOrientation } = useConfig();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  // common header
  const mainHeader: ReactNode = (
    <Toolbar sx={{ pr: { xs: 1, lg: 1.5 } }}>
      {!isHorizontal ? (
        <Tooltip title={drawerOpen ? 'Fold Menubar' : 'Unfold Menubar'}>
          <IconButton
            aria-label="open drawer"
            onClick={() => handlerDrawerOpen(!drawerOpen)}
            edge="start"
            color="secondary"
            variant="light"
            sx={{ color: 'white', bgcolor: 'transparent', ml: { xs: -1 /*0*/, lg: -2 } }}
            //color: drawerOpen ? 'white' : 'text.primary', bgcolor: drawerOpen ? 'transparent' : iconBackColor
          >
            {!drawerOpen ? <FontAwesomeIcon icon={faIndent} /> : <FontAwesomeIcon icon={faOutdent} />}
          </IconButton>
        </Tooltip>
      ) : null}
      {headerContent}
    </Toolbar>
  );

  // app-bar params
  const appBar: AppBarProps = {
    position: 'fixed',
    color: 'primary',
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: isHorizontal
        ? '100%'
        : { xs: '100%', lg: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : `calc(100% - ${MINI_DRAWER_WIDTH}px)` }
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

export default Header;
