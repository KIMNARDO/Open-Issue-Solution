import { useCallback, useState } from 'react';

// material-ui
import { Box, Tooltip } from '@mui/material';

// project import
import IconButton from 'components/@extended/IconButton';

// assets
import { Fullscreen, ShrinkIcon } from 'lucide-react';

// ==============================|| HEADER CONTENT - FULLSCREEN ||============================== //

const FullScreen = () => {
  const [open, setOpen] = useState(false);
  const handleToggle = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
    if (document && !document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title={open ? 'Exit Fullscreen' : 'Fullscreen'}>
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'inherit', bgcolor: 'transparent' }} //color: open ? 'text.primary' : 'white', bgcolor: open ? iconBackColorOpen : 'transparent'
          aria-label="fullscreen toggler"
          onClick={handleToggle}
        >
          {open ? <ShrinkIcon /> : <Fullscreen />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default FullScreen;
