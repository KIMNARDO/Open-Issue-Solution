import React from 'react';

// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third party
// import * as Yup from 'yup';
import { Formik } from 'formik';

// project import
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// assets
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import useLocalStorage from 'hooks/useLocalStorage';

// ============================|| JWT - LOGIN ||============================ //

type SavedInfo = { id: string; saved: boolean };
type SavedInfoStorage = [SavedInfo, React.Dispatch<SavedInfo>];

const AuthLogin = ({ isDemo = false }: { isDemo?: boolean }) => {
  const [savedInfo, setSavedInfo] = useLocalStorage<SavedInfo>('save-account-id', { id: '', saved: false }) as SavedInfoStorage;

  const [checked, setChecked] = React.useState(savedInfo.saved);

  const { login } = useAuth();
  const scriptedRef = useScriptRef();

  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          userId: savedInfo.id,
          password: '',
          submit: null
        }}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            if (scriptedRef.current && (!values.userId || !values.password)) {
              throw new Error('아이디와 비밀번호를 입력해주세요.');
            }

            await login(values.userId, values.password);
            if (scriptedRef.current) {
              setStatus({ success: true });
              setSubmitting(false);
              // preload('api/menu/dashboard', fetcher); // load menu on login success

              setSavedInfo({ id: checked ? values.userId : '', saved: checked });
            }
          } catch (err: any) {
            if (scriptedRef.current) {
              setStatus({ success: false });
              setSubmitting(false);
              if (err.response) {
                setErrors({ submit: err.response.data.message || '' });
              } else {
                setErrors({ submit: err.message });
              }
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-login" sx={{ pl: 1, fontSize: '0.9rem' }}>
                    아이디
                  </InputLabel>
                  <OutlinedInput
                    id="email-login"
                    type="userId"
                    value={values.userId}
                    name="userId"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="아이디를 입력하세요" //Enter email address"
                    fullWidth
                    error={Boolean(touched.userId && errors.userId)}
                    sx={{ height: 48 }}
                  />
                </Stack>
                {touched.userId && errors.userId && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.userId}
                  </FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-login" sx={{ pl: 1, fontSize: '0.9rem' }}>
                    비밀번호
                  </InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="-password-login"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    sx={{ height: 48 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="비밀번호를 입력하세요" //Enter password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="standard-weight-helper-text-password-login">
                    {errors.password}
                  </FormHelperText>
                )}
              </Grid>

              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ height: 48 }}
                  >
                    로그인
                  </Button>
                </AnimateButton>
              </Grid>
              <Grid item xs={12} sx={{ mt: -1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={checked}
                        onChange={(event) => setChecked(event.target.checked)}
                        name="checked"
                        color="primary"
                        size="small"
                        sx={{ ml: -1, transform: 'translateY(-1px)' }}
                      />
                    }
                    label={<Typography variant="h6">아이디 저장</Typography>}
                  />
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthLogin;
