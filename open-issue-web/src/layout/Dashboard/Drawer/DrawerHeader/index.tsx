// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

// project import
import DrawerHeaderStyled from './DrawerHeaderStyled';
import Logo from 'components/logo';
import useConfig from 'hooks/useConfig';

// types
import { MenuOrientation } from 'types/config';

// ==============================|| DRAWER HEADER ||============================== //

interface Props {
  open: boolean;
}

const DrawerHeader = ({ open }: Props) => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  return (
    <DrawerHeaderStyled
      theme={theme}
      open={open}
      sx={{
        minHeight: isHorizontal ? 'unset' : '60px',
        width: isHorizontal ? { xs: '100%', lg: '424px' } : 'inherit',
        paddingTop: 0, //isHorizontal ? { xs: '10px', lg: '0' } : '8px',
        paddingBottom: 0, //isHorizontal ? { xs: '18px', lg: '0' } : '8px',
        paddingLeft: open ? '8px' : 0, //isHorizontal ? { xs: '24px', lg: '0' } : open ? '24px' : 0
        boxShadow: `0 1px 1px ${theme.palette.grey[200]}`
      }}
    >
      <Logo isIcon={!open} />
      {/* sx={{ width: open ? 'auto' : 35, height: 35 }} */}
    </DrawerHeaderStyled>
  );
};

export default DrawerHeader;
