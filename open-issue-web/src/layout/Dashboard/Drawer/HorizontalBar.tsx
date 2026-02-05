// material-ui
import { useTheme } from '@mui/material/styles';
import { AppBar, Box, Container, useMediaQuery } from '@mui/material';

// project imports
import Navigation from './DrawerContent/Navigation';
import useConfig from 'hooks/useConfig';
import { ElevationScroll } from './ElevationScroll';

import Logo from 'components/logo';
import FullScreen from '../Header/HeaderContent/FullScreen';
import Profile from '../Header/HeaderContent/Profile';
import Logout from '../Header/HeaderContent/Logout';
import LanguageSelector from '../Header/HeaderContent/LanguageSelector';
import Settings from '../Header/HeaderContent/Settings';

const CustomAppBar = () => {
  const theme = useTheme();
  const { container } = useConfig();

  const minimum = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ElevationScroll>
      <AppBar
        sx={{
          top: 0,
          bgcolor: theme.palette.background.paper,
          width: '100%',
          height: 60,
          justifyContent: 'center',
          borderTop: `1px solid ${theme.palette.divider}`,
          //borderBottom: `1px solid ${theme.palette.divider}`,
          zIndex: 1298,
          color: theme.palette.grey[500],
          overflowX: minimum ? 'scroll' : 'hidden',
          overflowY: 'hidden',
          msScrollbarTrackColor: theme.palette.primary.light,
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
        }}
      >
        <Container
          maxWidth={container ? 'xl' : false}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            px: '12px !important',
            '&>.MuiBox-root': { display: 'flex', alignItems: 'center' }
          }}
        >
          <Box>
            <Logo />
            <Navigation />
          </Box>
          <Box sx={{ color: theme.palette.primary.main }}>
            <LanguageSelector />
            <Settings />
            <FullScreen />
            <Profile />
            <Logout />
          </Box>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
};

export default CustomAppBar;
