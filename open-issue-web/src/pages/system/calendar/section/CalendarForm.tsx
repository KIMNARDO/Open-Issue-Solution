import { Grid } from '@mui/material';
import { withSimpleForm } from 'components/form/SimpleForm';
import FormInput from 'components/input/FormInput';

const CalendarForm = withSimpleForm<any>(({ formikProps }) => {
  return (
    <>
      <Grid container rowSpacing={2} columnSpacing={2} sx={{ height: '60px' }}>
        <Grid item xs={6}>
          <FormInput label="제목" variant="outlined" name="name" value={formikProps.values.name} placeholder="-" />
        </Grid>
        <Grid item xs={6}>
          <FormInput label="내용" variant="outlined" name="description" value={formikProps.values.description} placeholder="-" />
        </Grid>
      </Grid>
    </>
  );
});

export default CalendarForm;
