// material-ui
import { Box, Tooltip } from '@mui/material';

// project import
import IconButton from 'components/@extended/IconButton';

import useBasicDialog from 'components/dialogs/useBasicDialog';

// assets
import UserInfoDialog from 'pages/system/dialog/user-information/UserInfoDialog';
import { UserOutlined } from '@ant-design/icons';
import { User } from 'lucide-react';

// types
// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile = () => {
  const { BasicDialog, handleOpen } = useBasicDialog();

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Tooltip title="User">
        <IconButton
          color="secondary"
          variant="light"
          sx={{ color: 'inherit', bgcolor: 'transparent' }}
          aria-label="open profile"
          onClick={handleOpen}
        >
          <User />
        </IconButton>
      </Tooltip>
      <UserInfoDialog {...{ BasicDialog }} />
    </Box>
  );
};

export default Profile;
