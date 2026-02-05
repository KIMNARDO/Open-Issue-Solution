import { Box, Grid, Typography } from '@mui/material';
import { UserValidationType } from 'api/system/user/user.types';
import FormDatePicker from 'components/datepicker/FormDatePicker';
import useFileUploader from 'components/fileUploader/useFileUploader';
import { withSimpleForm } from 'components/form/SimpleForm';
import FormInput from 'components/input/FormInput';
import FormSelect from 'components/select/FormSelect';
import CustomSwitch from 'components/switch/Switch';
import useLibrary from 'hooks/useLibrary';
import { useEffect } from 'react';
import { useAuthGroupList } from '../../../../api/system/auth/useAuthService';
import { SelectboxType } from 'components/select/selectbox.types';

interface MainFormProps {
  selectedUser?: UserValidationType;
}

const MainForm = withSimpleForm<any, MainFormProps>(({ formikProps, selectedUser }) => {
  const { FileUploader, reset, uploadedFile } = useFileUploader({
    name: 'signature',
    multiple: false,
    types: ['png', 'jpg', 'jpeg'],
    dropMsg: '드롭하여 업로드',
    disabled: true
  });
  const {
    FileUploader: thumbnailUploader,
    reset: resetThumbnail,
    uploadedFile: thumbnailFile
  } = useFileUploader({
    name: 'thumbnail',
    multiple: false,
    types: ['png', 'jpg', 'jpeg'],
    dropMsg: '드롭하여 업로드',
    disabled: true
  });

  const { librarySelect } = useLibrary();
  const { data: authGroups } = useAuthGroupList({});

  useEffect(() => {
    if (!uploadedFile) return;
    formikProps.setFieldValue('signature', uploadedFile?.[0].name || '');
  }, [uploadedFile]);

  useEffect(() => {
    const signatureValue = formikProps.values.signature;
    if (!signatureValue || signatureValue === '') {
      reset();
    }
  }, [formikProps.values.signature]);

  useEffect(() => {
    if (!thumbnailFile) return;
    formikProps.setFieldValue('thumbnail', thumbnailFile?.[0].name || '');
  }, [thumbnailFile]);

  useEffect(() => {
    const thumbnailValue = formikProps.values.thumbnail;
    if (!thumbnailValue || thumbnailValue === '') {
      resetThumbnail();
    }
  }, [formikProps.values.thumbnail]);

  return (
    <Box marginBottom={1} py={2}>
      <Grid container spacing={2}>
        <Grid item md={3} xs={6}>
          <FormInput
            required
            name="id"
            label="아이디"
            value={formikProps.values.id ?? ''}
            onChange={formikProps.handleChange}
            variant="outlined"
            helperText={formikProps.errors.id as string}
            error={!!formikProps.errors.id}
            disabled
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormInput
            required
            name="password"
            type="password"
            label="비밀번호"
            value={formikProps.values.password ?? ''}
            onChange={formikProps.handleChange}
            variant="outlined"
            helperText={formikProps.errors.password as string}
            error={!!formikProps.errors.password}
            disabled={!!selectedUser}
          />
        </Grid>
        {/* <Grid item md={3} xs={6}>
          <FormSelect
            name="authorities"
            label="권한"
            value={formikProps.values.grpUid?.toString() ?? ''}
            onChange={(e) => formikProps.setFieldValue('grpUid', Number(e.target.value))}
            selectProps={{
              items: authGroups?.map<SelectboxType>((grp) => ({ label: grp.grpName, value: grp.grpUid.toString() })) || []
            }}
          />
        </Grid> */}
        <Grid item md={3} xs={6}>
          <FormDatePicker
            disabled
            name="createDt"
            label="등록일"
            error={formikProps.errors.createDt as string}
            setValue={formikProps.setFieldValue}
            value={formikProps.values.createDt ?? ''}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormInput
            required
            name="name"
            label="이름"
            value={formikProps.values.name ?? ''}
            onChange={formikProps.handleChange}
            variant="outlined"
            helperText={formikProps.errors.name as string}
            error={!!formikProps.errors.name}
            disabled
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormSelect
            name="departmentOid"
            label="부서"
            value={formikProps.values.departmentOid || ''}
            onChange={(e) => formikProps.setFieldValue('departmentOid', e.target.value)}
            selectProps={{
              items: librarySelect['DEPARTMENT']
            }}
            disabled
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormInput
            name="empNo"
            label="사번"
            value={formikProps.values.empNo ?? ''}
            onChange={formikProps.handleChange}
            variant="outlined"
            helperText={formikProps.errors.empNo as string}
            error={!!formikProps.errors.empNo}
            disabled={true}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormSelect
            name="jobTitle"
            label="직책"
            value={formikProps.values.jobTitleOID ?? ''}
            onChange={(e) => formikProps.setFieldValue('jobTitleOID', e.target.value)}
            selectProps={{
              items: librarySelect.jobTitle || []
            }}
            disabled
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormSelect
            name="jobPositionOID"
            label="직급"
            value={formikProps.values.jobPositionOID ?? ''}
            onChange={(e) => formikProps.setFieldValue('jobPositionOID', e.target.value)}
            selectProps={{
              items: librarySelect.jobPositionOID || []
            }}
            disabled
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormInput
            required
            name="email"
            label="이메일"
            value={formikProps.values.email ?? ''}
            onChange={formikProps.handleChange}
            variant="outlined"
            helperText={formikProps.errors.email as string}
            error={!!formikProps.errors.email}
            disabled
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormInput
            name="phone"
            label="전화번호"
            value={formikProps.values.phone ?? ''}
            onChange={formikProps.handleChange}
            variant="outlined"
            required
            error={!!formikProps.errors.phone}
            helperText={formikProps.errors.phone as string}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormSelect
            name="nation"
            label="국가"
            value={formikProps.values.nation ?? ''}
            onChange={(e) => formikProps.setFieldValue('nation', e.target.value)}
            selectProps={{
              items: librarySelect.nation || []
            }}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormSelect
            name="jobGroupOID"
            label="직군"
            value={formikProps.values.jobGroupOID ?? ''}
            onChange={(e) => formikProps.setFieldValue('jobGroupOID', e.target.value)}
            selectProps={{
              items: librarySelect.jobGroupOID || []
            }}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <FormDatePicker
            disabled
            label="입사일"
            name="enterDt"
            setValue={formikProps.setFieldValue}
            value={formikProps.values.enterDt ?? ''}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <CustomSwitch
            name="isUse"
            label="사용여부"
            labelDirection="top"
            value={formikProps.values.isUse || 0}
            handleChange={(e) => formikProps.setFieldValue('isUse', e.target.checked ? 1 : 0)}
            valueFormat={{ true: 1, false: 0 }}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <CustomSwitch
            name="hiddenGuest"
            label="숨은 참조자"
            labelDirection="top"
            value={formikProps.values.hiddenGuest || 0}
            handleChange={(e) => formikProps.setFieldValue('hiddenGuest', e.target.checked ? 1 : 0)}
            valueFormat={{ true: 1, false: 0 }}
          />
        </Grid>
        <Grid item md={3} xs={6}>
          <CustomSwitch
            name="check2FA"
            label="2차 인증"
            labelDirection="top"
            value={formikProps.values.check2FA || 0}
            handleChange={(e) => formikProps.setFieldValue('check2FA', e.target.checked ? 1 : 0)}
            valueFormat={{ true: 1, false: 0 }}
          />
        </Grid>
        <Grid item md={3} xs={6} />
        <Grid item md={3} xs={6}>
          <Typography variant="h6" sx={{ textIndent: 4 }}>
            서명
          </Typography>
          <Box sx={{ height: 130 }}>{FileUploader}</Box>
        </Grid>
        <Grid item md={3} xs={6}>
          <Typography variant="h6" sx={{ textIndent: 4 }}>
            사진
          </Typography>
          <Box sx={{ height: 130 }}>{thumbnailUploader}</Box>
        </Grid>
      </Grid>
    </Box>
  );
});

export default MainForm;
