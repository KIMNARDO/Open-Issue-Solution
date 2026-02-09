import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Error500 = () => {
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
      <Typography variant="h1" color="error">500</Typography>
      <Typography variant="h4">서버 오류가 발생했습니다</Typography>
      <Button variant="contained" onClick={() => navigate('/Qms/OpenIssueList')}>
        Open Issue로 이동
      </Button>
    </Box>
  );
};

export default Error500;
