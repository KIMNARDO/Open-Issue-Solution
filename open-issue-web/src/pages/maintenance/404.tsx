import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <Typography variant="h1" color="primary">404</Typography>
      <Typography variant="h4">페이지를 찾을 수 없습니다</Typography>
      <Button variant="contained" onClick={() => navigate('/Qms/OpenIssueList')}>
        Open Issue로 이동
      </Button>
    </Box>
  );
};

export default Error404;
