import { withSimpleForm } from 'components/form/SimpleForm';
import { Box, Grid, IconButton, Typography } from '@mui/material';
import FormInput from 'components/input/FormInput';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { FormikProps } from 'formik';
import { useAuthGroupList } from '../../../../api/system/auth/useAuthService';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import BodyForm from 'components/form/BodyForm';
import BodySection from 'components/form/BodySection';
import FormLayout from 'components/form/FormLayout';
import useFileUploader from 'components/fileUploader/useFileUploader';
import FormDatePicker from 'components/datepicker/FormDatePicker';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomSwitch from 'components/switch/Switch';
import { User, userSchema } from 'api/system/user/user.types';
import FormSelect from 'components/select/FormSelect';
import { SelectboxType } from 'components/select/selectbox.types';
import useLibrary from 'hooks/useLibrary';
import { CurrentGroup } from 'pages/system/user-manage';

const UserForm = withSimpleForm<any, { currentGroup?: CurrentGroup }>(({ formikProps, currentGroup }) => {
  const {
    FileUploader: ThumbnailUploader,
    imagePreview: thumbnailPreview,
    reset: resetThumbnail
  } = useFileUploader({ name: 'thumbnail', multiple: false });
  const { FileUploader: SignUploader, imagePreview: signPreview, reset: resetSign } = useFileUploader({ name: 'sign', multiple: false });
  const { data: authGroups } = useAuthGroupList({});
  const { librarySelect } = useLibrary();

  useEffect(() => {
    if (currentGroup) {
      formikProps.resetForm({
        values: {
          ...formikProps.initialValues, // 기존 initialValues 유지
          departmentOID: currentGroup.departmentOID,
          departmentNm: currentGroup.departmentNm
        }
      });
    } else {
      formikProps.resetForm({
        values: {
          ...formikProps.initialValues // 기존 initialValues 유지
        }
      });
    }
  }, [currentGroup]);

  return (
    <>
      <FormLayout sx={{ height: '70vh' }}>
        <BodyForm>
          {/* 썸네일 영역 */}
          <BodySection>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                  사진
                </Typography>
                <Box display="flex" justifyContent="center" position="relative">
                  {thumbnailPreview ? (
                    <>
                      <IconButton sx={{ position: 'absolute', top: 0, right: 0, zIndex: 99 }} onClick={() => resetThumbnail([])}>
                        <FontAwesomeIcon icon={faX} />
                      </IconButton>
                      <img width={'50%'} src={thumbnailPreview} alt="thumbnail" />
                    </>
                  ) : (
                    ThumbnailUploader
                  )}
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
                  서명
                </Typography>
                <Box display="flex" justifyContent="center" position="relative">
                  {signPreview ? (
                    <>
                      <IconButton sx={{ position: 'absolute', top: 0, right: 0, zIndex: 99 }} onClick={() => resetSign([])}>
                        <FontAwesomeIcon icon={faX} />
                      </IconButton>
                      <img width={'50%'} src={signPreview} alt="" />
                    </>
                  ) : (
                    SignUploader
                  )}
                </Box>
              </Grid>
            </Grid>
          </BodySection>

          {/* 상세 정보 영역 */}
          <BodySection>
            <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: 'primary.main' }}>
              정보
            </Typography>
            <Grid container spacing={3} columns={12}>
              {/* 사용자 이름	 */}
              <Grid item xs={12} sm={6}>
                <FormInput
                  name="name"
                  label="사용자 이름"
                  variant="outlined"
                  value={formikProps.values.name || ''}
                  required
                  error={!!formikProps.errors.name}
                  helperText={formikProps.errors.name as string}
                  onChange={formikProps.handleChange}
                  fullWidth
                />
              </Grid>
              {/* 로그인 ID	 */}
              <Grid item xs={12} sm={6}>
                <FormInput
                  name="id"
                  label="로그인 ID"
                  variant="outlined"
                  value={formikProps.values.id || ''}
                  required
                  error={!!formikProps.errors.id}
                  helperText={formikProps.errors.id as string}
                  onChange={formikProps.handleChange}
                  fullWidth
                />
              </Grid>
              {/* 패스워드	 */}
              <Grid item xs={12} sm={6}>
                <FormInput
                  name="password"
                  label="패스워드"
                  variant="outlined"
                  value={formikProps.values.password || ''}
                  required
                  error={!!formikProps.errors.password}
                  helperText={formikProps.errors.password as string}
                  onChange={formikProps.handleChange}
                  fullWidth
                />
              </Grid>
              {/* 사용자 사번	 */}
              <Grid item xs={12} sm={6}>
                <FormInput
                  name="empNo"
                  label="사용자 사번"
                  variant="outlined"
                  value={formikProps.values.empNo || ''}
                  required
                  error={!!formikProps.errors.empNo}
                  helperText={formikProps.errors.empNo as string}
                  onChange={formikProps.handleChange}
                  fullWidth
                />
              </Grid>
              {/* 사용자 부서 */}
              <Grid item xs={12} sm={6}>
                <FormInput
                  name="departmentNm"
                  label="사용자 부서"
                  variant="outlined"
                  value={formikProps.values.departmentNm || ''}
                  required
                  error={!!formikProps.errors.departmentNm}
                  helperText={formikProps.errors.departmentNm as string}
                  onChange={formikProps.handleChange}
                  fullWidth
                  disabled
                />
              </Grid>
              {/* 사용자 직급	 */}
              <Grid item md={6} xs={6}>
                <FormSelect
                  name="jobPositionOID"
                  label="직급"
                  value={formikProps.values.jobPositionOID ?? ''}
                  onChange={(e) => formikProps.setFieldValue('jobPositionOID', e.target.value)}
                  selectProps={{
                    items: librarySelect.jobPositionOID || []
                  }}
                />
              </Grid>
              {/* 사용자 직책	 */}
              <Grid item md={6} xs={6}>
                <FormSelect
                  name="jobTitle"
                  label="직책"
                  value={formikProps.values.jobTitleOID ?? ''}
                  onChange={(e) => formikProps.setFieldValue('jobTitleOID', e.target.value)}
                  selectProps={{
                    items: librarySelect.jobTitle || []
                  }}
                />
              </Grid>
              {/* 사용자 E-Mail	 */}
              <Grid item xs={12} sm={6}>
                <FormInput
                  name="email"
                  label="사용자 E-Mail"
                  variant="outlined"
                  value={formikProps.values.email || ''}
                  required
                  error={!!formikProps.errors.email}
                  helperText={formikProps.errors.email as string}
                  onChange={formikProps.handleChange}
                  fullWidth
                />
              </Grid>
              {/* 사용자 입사일자	 */}
              <Grid item xs={12} sm={6}>
                <FormDatePicker
                  name="enterDt"
                  label="사용자 입사일자"
                  setValue={formikProps.setFieldValue}
                  value={formikProps.values.enterDt}
                />
                {/* <FormDatePicker name="enterDt" label="사용자 입사일자" setValue={formikProps.values.enterDt} /> */}
                {/* <FormInput
                  name="enterDt"
                  label="사용자 입사일자"
                  variant="outlined"
                  value={formikProps.values.enterDt || ''}
                  required
                  error={!!formikProps.errors.enterDt}
                  helperText={formikProps.errors.enterDt as string}
                  onChange={formikProps.handleChange}
                  fullWidth
                /> */}
              </Grid>
              {/* 권한 */}
              <Grid item md={6} xs={6}>
                <FormSelect
                  name="authorities"
                  label="권한"
                  value={formikProps.values.grpUid?.toString() ?? ''}
                  onChange={(e) => formikProps.setFieldValue('grpUid', Number(e.target.value))}
                  selectProps={{
                    items: authGroups?.map<SelectboxType>((grp) => ({ label: grp.grpName, value: grp.grpUid.toString() })) || []
                  }}
                />
              </Grid>
              {/* 사용자 사용 유무	 */}
              <Grid item xs={12} sm={6}>
                <CustomSwitch
                  name="isUse"
                  label="사용유무"
                  labelDirection="top"
                  value={formikProps.values.isUse || 0}
                  handleChange={(e) => formikProps.setFieldValue('isUse', e.target.checked ? 1 : 0)}
                  valueFormat={{ true: 1, false: 0 }}
                />
              </Grid>
              {/* 숨은 참조자 사용 여부	 */}
              <Grid item xs={12} sm={6}>
                <CustomSwitch
                  name="hiddenGuest"
                  label="숨은 참조자"
                  labelDirection="top"
                  value={formikProps.values.hiddenGuest || 0}
                  handleChange={(e) => formikProps.setFieldValue('hiddenGuest', e.target.checked ? 1 : 0)}
                  valueFormat={{ true: 1, false: 0 }}
                />
              </Grid>
              {/* 직군 */}
              <Grid item md={6} xs={6}>
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
              {/* 국가 */}
              <Grid item md={6} xs={6}>
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
              {/* 2차 인증	 */}
              <Grid item xs={12} sm={6}>
                <CustomSwitch
                  name="check2FA"
                  label="2차 인증"
                  labelDirection="top"
                  value={formikProps.values.check2FA || 0}
                  handleChange={(e) => formikProps.setFieldValue('check2FA', e.target.checked ? 1 : 0)}
                  valueFormat={{ true: 1, false: 0 }}
                />
              </Grid>
              {/* 핸드폰 번호 */}
              <Grid item xs={12} sm={6}>
                <FormInput
                  name="phone"
                  label="핸드폰 번호"
                  variant="outlined"
                  value={formikProps.values.phone || ''}
                  required
                  error={!!formikProps.errors.phone}
                  helperText={formikProps.errors.phone as string}
                  onChange={formikProps.handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
          </BodySection>
        </BodyForm>
      </FormLayout>
    </>
  );
});

interface UserDetailDialogProps {
  onSubmit?: (values: User) => void;
  currentGroup?: CurrentGroup;
}

const AddUserDialog = forwardRef<BasicDialogRef, UserDetailDialogProps>(({ onSubmit, currentGroup }, ref) => {
  const formRef = useRef<FormikProps<any>>(null);

  const { BasicDialog, handleOpen, handleClose } = useBasicDialog();

  const handleFormSubmit = (values: User) => {
    // if (mode === 'edit') {
    // } else if (mode === 'add') {
    // }
    onSubmit?.(values);
    handleClose();
  };

  useImperativeHandle(
    ref,
    () => ({
      open: () => {
        handleOpen();
      },
      close: () => {
        handleClose();
      }
    }),
    []
  );

  return (
    <BasicDialog
      options={{ title: '사용자 상세', confirmText: '등록', cancelText: '닫기' }}
      actionButtons
      handleConfirm={() => {
        formRef.current?.submitForm();
      }}
    >
      <UserForm
        ref={formRef}
        onSubmit={handleFormSubmit}
        initialValues={{ check2FA: 0, isUse: 0 }}
        containerStyle={{ overflow: 'auto' }}
        currentGroup={currentGroup}
        validationSchema={userSchema}
      />
    </BasicDialog>
  );
});

export default AddUserDialog;
