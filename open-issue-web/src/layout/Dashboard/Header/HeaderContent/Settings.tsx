// material-ui
import { Box, Tooltip } from '@mui/material';

// project import
import IconButton from 'components/@extended/IconButton';

// assets
import { SettingOutlined } from '@ant-design/icons';
import { SettingsModal } from 'components/dialogs/SettingsModal';
import { useState } from 'react';
import { SettingsIcon } from 'lucide-react';

// ==============================|| HEADER CONTENT - FULLSCREEN ||============================== //

const Settings = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title="settings">
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'inherit', bgcolor: 'transparent' }}
          aria-label="settings"
          onClick={() => {
            setOpen(true);
          }}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <SettingsModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
};

export default Settings;
