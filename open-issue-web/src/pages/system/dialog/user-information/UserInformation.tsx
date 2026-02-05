import { Box, Grid, TextField, Switch } from '@mui/material';
import { useFormik } from 'formik';
import { DatePicker } from '@mui/x-date-pickers';
import useAuth from 'hooks/useAuth';
import { UserPartialType } from 'api/system/user/user.types';
import { forwardRef, useImperativeHandle } from 'react';
import dayjs from 'dayjs';
import useLibrary from 'hooks/useLibrary';
import FormSelect from 'components/select/FormSelect';

const dateFormat = 'YYYY-MM-DD';

export interface UserInformationRef {
  getUserData: () => UserPartialType;
}

const UserInformation = forwardRef<UserInformationRef>((_, ref) => {
  const { user } = useAuth();
  const { librarySelect } = useLibrary();

  const formik = useFormik<UserPartialType>({
    initialValues: { ...user },
    onSubmit: () => {},
    validateOnChange: false
  });

  useImperativeHandle(ref, () => ({
    getUserData: () => formik.values
  }));

  return (
    <>
      <Box sx={{ mt: 2, width: 600 }}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={4}>
            {'아이디'}
          </Grid>
          <Grid item xs={8}>
            <TextField value={formik.values.id || ''} disabled fullWidth />
          </Grid>
          <Grid item xs={4}>
            {'이름'}
          </Grid>
          <Grid item xs={8}>
            <TextField
              value={formik.values.name || ''}
              name="name"
              placeholder="-"
              onChange={(e) => {
                formik.setFieldValue('name', e.target.value, false);
              }}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            {'등록일'}
          </Grid>
          <Grid item xs={8}>
            <DatePicker
              value={dayjs(formik.values.createDt, dateFormat)}
              format={dateFormat}
              onChange={(value) => formik.setFieldValue('createDt', dayjs(value).format(dateFormat))}
              disabled
              sx={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={4}>
            {'부서'}
          </Grid>
          <Grid item xs={8}>
            <FormSelect
              onChange={(e) => formik.setFieldValue('departmentNm', e.target.value)}
              selectProps={{
                items: librarySelect['DEPARTMENT']
              }}
              value={formik.values.departmentNm || ''}
              name="departmentNm"
              label=""
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            {'사번'}
          </Grid>
          <Grid item xs={8}>
            <TextField
              value={formik.values.empNo || ''}
              name="empNo"
              placeholder="-"
              onChange={(e) => {
                formik.setFieldValue('empNo', e.target.value, false);
              }}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            {'직급'}
          </Grid>
          <Grid item xs={8}>
            <TextField
              value={formik.values.jobPositionNm || ''}
              name="jobPositionNm"
              placeholder="-"
              onChange={(e) => {
                formik.setFieldValue('jobPositionNm', e.target.value, false);
              }}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            {'이메일'}
          </Grid>
          <Grid item xs={8}>
            <TextField
              name="email"
              value={formik.values.email}
              placeholder="-"
              onChange={(e) => {
                formik.setFieldValue('email', e.target.value, false);
              }}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            {'전화번호'}
          </Grid>
          <Grid item xs={8}>
            <TextField
              name="mobile"
              value={formik.values.phone || ''}
              placeholder="-"
              onChange={(e) => {
                formik.setFieldValue('phone', e.target.value, false);
              }}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            {'유저그룹'}
          </Grid>
          <Grid item xs={8}>
            <TextField value={formik.values.grpUid || ''} name="grpUid" label="" disabled fullWidth />
          </Grid>
          <Grid item xs={4}>
            {'사용여부'}
          </Grid>
          <Grid item xs={8}>
            <Switch
              name="active"
              value={formik.values.isUse || 'N'}
              onChange={(e) => formik.setFieldValue('isUse', e.target.checked ? 'Y' : 'N')}
              disabled
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
});

export default UserInformation;
