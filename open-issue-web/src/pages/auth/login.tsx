// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import useAuth from 'hooks/useAuth';
import AuthWrapper from 'pages/auth/sections/auth/AuthWrapper';
import AuthLogin from 'pages/auth/sections/auth/auth-forms/AuthLogin';

//logo import
import LogoMain from 'components/logo/LogoMain';

// ================================|| LOGIN ||================================ //

const Login = () => {
  const { isLoggedIn } = useAuth();
  // const theme = useTheme();
  // const downLG = useMediaQuery(theme.breakpoints.down('lg'));
  return (
    <AuthWrapper>
      <Grid container spacing={5 /*3 */} sx={{ px: 6, pt: 7, pb: 8 }}>
        <Grid item xs={12}>
          <Stack direction="column" justifyContent="space-between" alignItems="baseline" sx={{ mb: 5 /*{ xs: -0.5, sm: 0.5 }*/ }}>
            {/*direction="row"*/}
            <div style={{ transform: 'translateX(-10px)' }}>
              <LogoMain width={320} height={70} />
            </div>
            <Typography variant="body1" style={{ width: '100%', textAlign: 'center', fontWeight: 300 }}>
              (주)우리산업 PLM
            </Typography>
            {/*variant="h5"*/}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin isDemo={isLoggedIn} />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Login;
