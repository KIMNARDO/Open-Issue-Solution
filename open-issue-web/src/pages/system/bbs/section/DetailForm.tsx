import { withSimpleForm } from 'components/form/SimpleForm';
import { Box, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import FormInput from 'components/input/FormInput';
import FormDatePicker from 'components/datepicker/FormDatePicker';

const DetailForm = withSimpleForm(({ formikProps }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <FormInput name="title" label="제목" variant="outlined" />
      </Grid>
      <Grid item xs={3}>
        <FormInput name="title" label="작성자" variant="outlined" disabled />
      </Grid>
      <Grid item xs={9}>
        <Typography variant="h6">팝업설정</Typography>
        <Box display="flex" alignItems="center">
          <FormControlLabel control={<Checkbox name="popup" />} label="중요 팝업" />
          <FormDatePicker name="popupDate" label="" setValue={formikProps.setFieldValue} width={200} />
          &nbsp;{'까지 게시'}
        </Box>
      </Grid>
      <Grid item xs={3}>
        <FormInput name="title" label="작성일" variant="outlined" dateString disabled />
      </Grid>
      <Grid item xs={12}>
        <SimpleEditor height="calc(100vh - 390px)" />
      </Grid>
    </Grid>
  );
});

export default DetailForm;
