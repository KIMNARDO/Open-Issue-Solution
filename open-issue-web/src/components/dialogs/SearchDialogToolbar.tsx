import { TextField, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import CommonButton from 'components/buttons/CommonButton';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import { SearchOutlined } from '@ant-design/icons';
import { SearchConditionField } from './SearchDialog.types';

interface SearchDialogToolbarProps {
  searchConditions: SearchConditionField[];
}

const SearchDialogToolbar = withSimpleSearchForm<Record<string, any>, SearchDialogToolbarProps>(({ formikProps, searchConditions }) => {
  return (
    <>
      {searchConditions.map((condition) => {
        switch (condition.type) {
          case 'text':
            return (
              <TextField
                key={condition.name}
                name={condition.name}
                label={condition.label}
                placeholder={condition.placeholder || ''}
                value={formikProps.values[condition.name] || ''}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                variant="outlined"
                sx={{ maxWidth: 200 }}
              />
            );

          case 'select':
            return (
              <TextField
                key={condition.name}
                name={condition.name}
                label={condition.label}
                select
                value={formikProps.values[condition.name] || ''}
                onChange={formikProps.handleChange}
                onBlur={formikProps.handleBlur}
                variant="outlined"
                sx={{ maxWidth: 200 }}
              >
                <MenuItem value="">전체</MenuItem>
                {condition.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            );

          case 'boolean':
            return (
              <FormControlLabel
                key={condition.name}
                control={
                  <Checkbox name={condition.name} checked={!!formikProps.values[condition.name]} onChange={formikProps.handleChange} />
                }
                label={condition.label}
              />
            );

          default:
            return null;
        }
      })}
      <CommonButton
        type="submit"
        title="검색"
        variant="outlined"
        icon={<SearchOutlined />}
        icononly="true"
        onClick={() => formikProps.submitForm()}
      />
    </>
  );
});

export default SearchDialogToolbar;
