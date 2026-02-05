import { useState } from 'react';

// material-ui
import { Box, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material';

// project import
import IconButton from 'components/@extended/IconButton';

// assets
import krFlag from 'assets/images/icons/krFlag.svg';
import usFlag from 'assets/images/icons/usFlag.svg';
import useConfig from 'hooks/useConfig';
import { FormattedMessage } from 'react-intl';

// ==============================|| HEADER CONTENT - FULLSCREEN ||============================== //

const LanguageSelector = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { onChangeLocalization, i18n } = useConfig();

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title="Language">
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'inherit', bgcolor: 'transparent' }} //color: open ? 'text.primary' : 'white', bgcolor: open ? iconBackColorOpen : 'transparent'
          aria-label="fullscreen toggler"
          onClick={(e) => {
            setAnchorEl(e.currentTarget);
          }}
        >
          {i18n === 'ko' && <img src={krFlag} alt="krFlag" />}
          {i18n === 'en' && <img src={usFlag} alt="usFlag" />}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 24px rgba(39,52,105,0.03))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            onChangeLocalization('ko');
            setAnchorEl(null);
          }}
        >
          <img src={krFlag} alt="krFlag" />
          &nbsp;
          <ListItemText primary={<FormattedMessage id="korea" />} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            onChangeLocalization('en');
            setAnchorEl(null);
          }}
        >
          <img src={usFlag} alt="usFlag" />
          &nbsp;
          <ListItemText primary={<FormattedMessage id="english" />} />
        </MenuItem>
      </Menu>
      <br />
    </Box>
  );
};

export default LanguageSelector;
