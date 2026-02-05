import { useState, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom'; //Link

// material-ui
import { styled, useTheme, Theme } from '@mui/material/styles';
import { Box, IconButton, IconButtonProps, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import { useGetMenuMaster } from 'api/common/menu';
import useBasicDialog from 'components/dialogs/useBasicDialog';

// assets
import { faUserAlt, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import UserInfoDialog from 'pages/system/dialog/user-information/UserInfoDialog';

interface ExpandMoreProps extends IconButtonProps {
  theme: Theme;
  expand: boolean;
  drawerOpen: boolean;
}

const ExpandMore = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'theme' && prop !== 'expand' && prop !== 'drawerOpen' })(
  ({ theme, expand, drawerOpen }: ExpandMoreProps) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(-90deg)',
    marginLeft: 'auto',
    color: theme.palette.secondary.dark,
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    }),
    ...(!drawerOpen && {
      opacity: 0,
      width: 50,
      height: 50
    })
  })
);

// ==============================|| DRAWER - USER ||============================== //

const NavUser = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const { BasicDialog, handleOpen } = useBasicDialog();

  const { logout, user } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/login`, {
        state: {
          from: ''
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAnchorClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ px: 1.5, py: 1, borderTop: `1px solid ${theme.palette.divider}` }}>
        <List disablePadding>
          <ListItem
            disablePadding
            secondaryAction={
              <ExpandMore
                theme={theme}
                expand={open}
                drawerOpen={drawerOpen}
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                aria-label="show more"
              >
                <FontAwesomeIcon icon={faAngleRight} color={theme.palette.grey[500]} />
              </ExpandMore>
            }
            sx={{ '& .MuiListItemSecondaryAction-root': { right: !drawerOpen ? -20 : -12 /*-16*/ } }}
          >
            <ListItemAvatar>
              {/*<Avatar alt="Avatar" src={''} sx={{ width: 36, height: 36 }} />
              ...(drawerOpen && { width: 46, height: 46 }) }} */}
              <div
                style={{
                  background: theme.palette.primary.lighter,
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  padding: '6px 10px'
                }}
              >
                <FontAwesomeIcon icon={faUserAlt} color={theme.palette.primary.main} />
              </div>
            </ListItemAvatar>
            <ListItemText primary={user?.name} secondary={`${user?.departmentNm} / ${user?.jobPositionNm}`} sx={{ m: 0 }} />
          </ListItem>
        </List>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleAnchorClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button'
          }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
        >
          <MenuItem onClick={handleLogout}>로그아웃{/*Logout*/}</MenuItem>
          <MenuItem onClick={handleOpen}>
            내 정보
            {/*Profile*/}
          </MenuItem>
          {/* <MenuItem component={Link} to="#" onClick={handleClose}>
          My account
        </MenuItem> */}
        </Menu>
      </Box>

      <UserInfoDialog {...{ BasicDialog }} />
    </>
  );
};

export default NavUser;
