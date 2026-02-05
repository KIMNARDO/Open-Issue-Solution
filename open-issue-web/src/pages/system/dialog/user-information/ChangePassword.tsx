import { useState, SyntheticEvent } from 'react';

// material-ui
import {
  Box,
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

import IconButton from 'components/@extended/IconButton';

import { isNumber, isLowercaseChar, isUppercaseChar, minLength } from 'utils/password-validation';
import * as Yup from 'yup';
import { useFormik } from 'formik';

// assets
import { CheckOutlined, EyeOutlined, EyeInvisibleOutlined, LineOutlined, CloseOutlined } from '@ant-design/icons';

import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router';
import { commonNotification } from 'api/common/notification';

import { confirmation } from 'components/confirm/CommonConfirm';
import { useModifyUserPassword } from 'api/system/user/useUserService';
import { handleServerError } from 'utils/error';

// ==============================|| TAB - PASSWORD CHANGE ||============================== //

interface Password {
  old: string;
  password: string;
  confirm: string;
}

interface ChangePasswordProps {
  handleClose: () => void;
}

const passwordSchema = Yup.object({
  old: Yup.string().required('현재암호를 입력해주세요.'),
  password: Yup.string()
    .required('새암호를 입력해주세요.')
    .matches(/^.*(?=.{6,})(?=.*\d)((?=.*[a-zA-Z]){1}).*$/, '최소 6자리 이상, 숫자와 문자를 혼용해서 생성해주세요.'),
  confirm: Yup.string()
    .required('암호를 확인해주세요.')
    .test('confirm', '암호가 일치하지 않습니다.', (confirm: string, yup: any) => yup.parent.password === confirm)
});

const ChangePassword = ({ handleClose }: ChangePasswordProps) => {
  const navigate = useNavigate();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { logout, user } = useAuth();

  const { mutate: updatePassword } = useModifyUserPassword();

  const handleConfirm = () => {
    formik.handleSubmit();
  };

  const handleOnSubmit = async () => {
    const confirm = await confirmation({
      msg: '변경하시겠습니까?\n암호 변경 시 로그아웃되며 변경된 암호로 다시 로그인 해야합니다.',
      title: '암호 변경',
      buttonProps: {
        confirm: {
          variant: 'contained',
          title: '변경'
        },
        cancel: {
          variant: 'outlined',
          title: '취소'
        }
      }
    });

    if (!confirm) {
      return;
    }

    const passwordInfo = {
      userUid: user?.oid || 0,
      oldPassword: formik.values.old,
      newPassword: formik.values.confirm
    };

    updatePassword(passwordInfo, {
      async onSuccess(res) {
        if (res.data.code !== 0 || res.data.type === 'error') {
          commonNotification.error(res.data.message);
          return;
        } else {
          commonNotification.success('비밀번호가 변경되었습니다.');
        }

        handleClose();
        await handleLogout();
      },
      onError(err) {
        handleServerError(err);
      },
      onSettled() {
        formik.resetForm();
      }
    });
  };

  const formik = useFormik<Password>({
    initialValues: {
      confirm: '',
      old: '',
      password: ''
    },
    onSubmit: handleOnSubmit,
    validateOnChange: true,
    validationSchema: passwordSchema
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate(`../`, {
        state: {
          from: ''
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleClickShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };
  const handleClickShowNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <Box sx={{ mt: 2, width: 700 }}>
      <Grid container rowSpacing={2} columnSpacing={2}>
        <Grid item container xs={12} sm={6} rowSpacing={2}>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-old">
                <Typography variant="caption" sx={{ pl: 1 }}>
                  현재 암호
                </Typography>
              </InputLabel>
              <OutlinedInput
                id="password-old"
                placeholder="Enter Password"
                type={showOldPassword ? 'text' : 'password'}
                value={formik.values.old}
                name="old"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowOldPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                      color="secondary"
                    >
                      {showOldPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
                autoComplete="password-old"
              />
            </Stack>
            {formik.touched.old && formik.errors.old && (
              <FormHelperText error id="password-old-helper">
                {formik.errors.old}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-new">
                <Typography variant="caption" sx={{ pl: 1 }}>
                  새 암호
                </Typography>
              </InputLabel>
              <OutlinedInput
                id="password-new"
                placeholder="Enter New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={formik.values.password}
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowNewPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                      color="secondary"
                    >
                      {showNewPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
                autoComplete="password-new"
              />
            </Stack>
            {formik.touched.password && formik.errors.password && (
              <FormHelperText error id="password-password-helper">
                {formik.errors.password}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <Stack spacing={1}>
              <InputLabel htmlFor="password-confirm">
                <Typography variant="caption" sx={{ pl: 1 }}>
                  암호확인
                </Typography>
              </InputLabel>
              <OutlinedInput
                id="password-confirm"
                placeholder="Enter Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formik.values.confirm}
                name="confirm"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="large"
                      color="secondary"
                    >
                      {showConfirmPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
                autoComplete="password-confirm"
              />
            </Stack>
            {formik.touched.confirm && formik.errors.confirm && (
              <FormHelperText error id="password-confirm-helper">
                {formik.errors.confirm}
              </FormHelperText>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ p: { xs: 0, sm: 1, md: 2, lg: 3 } }}>
            <Typography variant="h5">{'새 암호 필수 입력 사항:'}</Typography>
            <List sx={{ p: 0 }}>
              <ListItem divider>
                <ListItemIcon sx={{ color: minLength(formik.values.password) ? 'success.main' : 'inherit' }}>
                  {minLength(formik.values.password) ? <CheckOutlined /> : <LineOutlined />}
                </ListItemIcon>
                <ListItemText primary={'최소 6글자'} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon
                  sx={{
                    color: isLowercaseChar(formik.values.password) || isUppercaseChar(formik.values.password) ? 'success.main' : 'inherit'
                  }}
                >
                  {isLowercaseChar(formik.values.password) || isUppercaseChar(formik.values.password) ? (
                    <CheckOutlined />
                  ) : (
                    <LineOutlined />
                  )}
                </ListItemIcon>
                <ListItemText primary={'문자 포함'} />
              </ListItem>
              <ListItem divider>
                <ListItemIcon sx={{ color: isNumber(formik.values.password) ? 'success.main' : 'inherit' }}>
                  {isNumber(formik.values.password) ? <CheckOutlined /> : <LineOutlined />}
                </ListItemIcon>
                <ListItemText primary={'숫자 포함 (0-9)'} />
              </ListItem>
            </List>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
            <Button variant="outlined" color="error" startIcon={<CloseOutlined />} onClick={handleClose}>
              취소
            </Button>
            <Button
              disabled={formik.isSubmitting || Object.keys(formik.errors).length !== 0}
              type="submit"
              variant="contained"
              startIcon={<CheckOutlined />}
              onClick={handleConfirm}
            >
              변경
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChangePassword;
