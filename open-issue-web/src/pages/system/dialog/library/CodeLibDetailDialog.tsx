import { withSimpleForm } from 'components/form/SimpleForm';
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import FormInput from 'components/input/FormInput';
import { CodeLibrary } from 'api/system/library/library.types';
import { FormikProps } from 'formik';
import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';
import { useMutation } from '@tanstack/react-query';
import libraryService from 'api/system/library/libraryService';
import { commonNotification } from 'api/common/notification';
import { handleServerError } from 'utils/error';

const CodeLibForm = withSimpleForm<any, { mode: 'add' | 'edit'; current?: CodeLibrary }>(({ formikProps, mode, current }) => {
  useEffect(() => {
    if (mode === 'add') {
      formikProps.resetForm({
        values: {
          isUse: 'Y',
          fromOID: current?.oid ?? ''
        }
      });
    } else {
      formikProps.resetForm({
        values: current
      });
    }
  }, [mode, current]);

  return (
    <>
      <Grid maxWidth={500} container spacing={2} p={3}>
        {/* row 1 */}
        <Grid item xs={3}>
          {'상위 코드'}
        </Grid>
        <Grid item xs={9}>
          <FormInput
            label=""
            name="fromOID"
            variant="outlined"
            value={formikProps.values.fromOID || ''}
            onChange={formikProps.handleChange}
            disabled
          />
        </Grid>
        {/* row 2 */}
        <Grid item xs={3}>
          {'코드1'}
        </Grid>
        <Grid item xs={9}>
          <FormInput label="" name="code1" variant="outlined" value={formikProps.values.code1 || ''} onChange={formikProps.handleChange} />
        </Grid>
        {/* row 3 */}
        <Grid item xs={3}>
          {'코드2'}
        </Grid>
        <Grid item xs={9}>
          <FormInput label="" name="code2" variant="outlined" value={formikProps.values.code2 || ''} onChange={formikProps.handleChange} />
        </Grid>
        {/* row 4 */}
        <Grid item xs={3}>
          {'이름'}
        </Grid>
        <Grid item xs={9}>
          <FormInput label="" name="korNm" variant="outlined" value={formikProps.values.korNm || ''} onChange={formikProps.handleChange} />
        </Grid>
        {/* row 5 */}
        <Grid item xs={3}>
          {'순서'}
        </Grid>
        <Grid item xs={9}>
          <FormInput label="" name="ord" variant="outlined" value={formikProps.values.ord || ''} onChange={formikProps.handleChange} />
        </Grid>
        {/* row 6 */}
        <Grid item xs={3}>
          {'설명'}
        </Grid>
        <Grid item xs={9}>
          <FormInput
            label=""
            name="description"
            variant="outlined"
            value={formikProps.values.description || ''}
            onChange={formikProps.handleChange}
          />
        </Grid>
        {/* row 7 */}
        <Grid item xs={3}>
          {'사용 여부'}
        </Grid>
        <Grid item xs={9}>
          <RadioGroup
            aria-labelledby="libDetail-radio-buttons-group-label"
            defaultValue="Y"
            name="isUse"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly'
            }}
            onChange={(e) => formikProps.setFieldValue('isUse', e.target.value)}
            value={formikProps.values.isUse}
          >
            <FormControlLabel value="Y" control={<Radio />} label="사용" />
            <FormControlLabel value="N" control={<Radio />} label="사용하지 않음" />
          </RadioGroup>
        </Grid>
      </Grid>
    </>
  );
});

interface CodeLibDetailDialogProps {
  mode: 'add' | 'edit';
  current?: CodeLibrary;
  onSubmit: () => void;
}

const CodeLibDetailDialog = forwardRef<BasicDialogRef, CodeLibDetailDialogProps>(({ mode, current, onSubmit }, ref) => {
  const formRef = useRef<FormikProps<any>>(null);

  const { BasicDialog, handleOpen, handleClose } = useBasicDialog();

  const { mutate: updateCodeLib } = useMutation({
    mutationFn: (payload: CodeLibrary) => libraryService.updateCodeLibrary(payload)
  });
  const { mutate: insertCodeLib } = useMutation({
    mutationFn: (payload: CodeLibrary) => libraryService.insertCodeLibrary(payload)
  });

  const handleFormSubmit = (values: CodeLibrary) => {
    if (mode === 'edit') {
      updateCodeLib(values, {
        onSuccess: () => {
          commonNotification.success('저장되었습니다');
          onSubmit();
          handleClose();
        },
        onError: (error) => handleServerError(error)
      });
    } else {
      insertCodeLib(values, {
        onSuccess: () => {
          commonNotification.success('저장되었습니다');
          onSubmit();
          handleClose();
        },
        onError: (error) => handleServerError(error)
      });
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      open: () => handleOpen(),
      close: () => handleClose()
    }),
    []
  );

  return (
    <BasicDialog
      options={{ title: '코드 라이브러리 상세', confirmText: '저장' }}
      actionButtons
      handleConfirm={() => {
        formRef.current?.submitForm();
      }}
    >
      <CodeLibForm ref={formRef} onSubmit={handleFormSubmit} initialValues={{}} mode={mode} current={current} />
    </BasicDialog>
  );
});

export default CodeLibDetailDialog;
