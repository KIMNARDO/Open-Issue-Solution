// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project import
import Search from './Search';
//import Message from './Message';
import Profile from './Profile';
//import Notification from './Notification';
import FullScreen from './FullScreen';
//import MobileSection from './MobileSection';
import Logout from './Logout';

import useConfig from 'hooks/useConfig';
import DrawerHeader from 'layout/Dashboard/Drawer/DrawerHeader';

// types
import { MenuOrientation } from 'types/config';
//import Customization from './Customization';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      {/*<Notification />
      <Message />
      <Customization />
      {!downLG && <Profile />}
      {downLG && <MobileSection />*/}
      {!downLG && <FullScreen />}
      <Profile />
      <Logout />
    </>
  );
};

export default HeaderContent;
