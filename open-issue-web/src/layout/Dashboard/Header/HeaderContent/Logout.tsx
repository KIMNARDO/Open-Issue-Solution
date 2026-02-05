import { useNavigate } from 'react-router';

// material-ui
import { Box, Tooltip } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import IconButton from 'components/@extended/IconButton';

// assets
import { LogOut } from 'lucide-react';

// ==============================|| HEADER CONTENT - FULLSCREEN ||============================== //

const Logout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
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

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title="Logout">
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'inherit', bgcolor: 'transparent' }}
          aria-label="logout"
          onClick={handleLogout}
        >
          <LogOut />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Logout;
