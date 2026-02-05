import { withSimpleForm } from 'components/form/SimpleForm';
import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';
import FormInput from 'components/input/FormInput';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { FormikProps } from 'formik';
import { DLibrary } from 'api/system/library/library.types';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { useMutation } from '@tanstack/react-query';
import libraryService from 'api/system/library/libraryService';
import { commonNotification } from 'api/common/notification';
import { handleServerError } from 'utils/error';

const LibForm = withSimpleForm<any, { mode: 'add' | 'edit'; current?: DLibrary }>(({ formikProps, mode, current }) => {
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
            variant="outlined"
            name="fromOID"
            value={formikProps.values.fromOID ?? ''}
            onChange={formikProps.handleChange}
            disabled
          />
        </Grid>
        {/* row 2 */}
        <Grid item xs={3}>
          {'코드'}
        </Grid>
        <Grid item xs={9}>
          <FormInput label="" variant="outlined" name="name" value={formikProps.values.name ?? ''} onChange={formikProps.handleChange} />
        </Grid>
        {/* row 3 */}
        <Grid item xs={3}>
          {'이름'}
        </Grid>
        <Grid item xs={9}>
          <FormInput label="" variant="outlined" name="korNm" value={formikProps.values.korNm ?? ''} onChange={formikProps.handleChange} />
        </Grid>
        {/* row 4 */}
        <Grid item xs={3}>
          {'순서'}
        </Grid>
        <Grid item xs={9}>
          <FormInput label="" variant="outlined" name="ord" value={formikProps.values.ord ?? ''} onChange={formikProps.handleChange} />
        </Grid>
        {/* row 5 */}
        <Grid item xs={3}>
          {'설명'}
        </Grid>
        <Grid item xs={9}>
          <FormInput
            label=""
            variant="outlined"
            name="description"
            value={formikProps.values.description ?? ''}
            onChange={formikProps.handleChange}
          />
        </Grid>
        {/* row 6 */}
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
            value={formikProps.values.isUse ?? ''}
            onChange={(e) => formikProps.setFieldValue('isUse', e.target.value)}
          >
            <FormControlLabel value="Y" control={<Radio />} label="사용" />
            <FormControlLabel value="N" control={<Radio />} label="사용하지 않음" />
          </RadioGroup>
        </Grid>
      </Grid>
    </>
  );
});

interface LibDetailDialogProps {
  current?: DLibrary;
  mode: 'add' | 'edit';
  onSubmit: () => void;
}

const LibDetailDialog = forwardRef<BasicDialogRef, LibDetailDialogProps>(({ mode, current, onSubmit }, ref) => {
  const formRef = useRef<FormikProps<any>>(null);

  const { BasicDialog, handleOpen, handleClose } = useBasicDialog();

  const { mutate: updateLibrary } = useMutation({ mutationFn: (payload: DLibrary) => libraryService.updateLibrary(payload) });
  const { mutate: insertLibrary } = useMutation({ mutationFn: (payload: DLibrary) => libraryService.insertLibrary(payload) });

  const handleFormSubmit = (values: DLibrary) => {
    if (mode === 'edit') {
      updateLibrary(values, {
        onSuccess: () => {
          commonNotification.success('저장되었습니다');
          onSubmit();
          handleClose();
        },
        onError: (error) => handleServerError(error)
      });
    } else {
      insertLibrary(values, {
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
      options={{ title: '라이브러리 상세', confirmText: '저장' }}
      actionButtons
      handleConfirm={() => {
        formRef.current?.submitForm();
      }}
    >
      <LibForm ref={formRef} onSubmit={handleFormSubmit} initialValues={{}} mode={mode} current={current} />
    </BasicDialog>
  );
});

export default LibDetailDialog;
