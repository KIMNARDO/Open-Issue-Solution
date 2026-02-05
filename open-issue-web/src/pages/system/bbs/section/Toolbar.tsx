import { SearchOutlined } from '@ant-design/icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TextField } from '@mui/material';
import CommonButton from 'components/buttons/CommonButton';
import DateSelectButton from 'components/buttons/DateSelectButton';
import { withSimpleSearchForm } from 'components/form/SimpleForm';

const Toolbar = withSimpleSearchForm(({ btnActions, formikProps }) => {
  return (
    <>
      <TextField
        name="searchWord"
        placeholder="검색어를 입력해주세요."
        value={formikProps.values.searchWord}
        onChange={formikProps.handleChange}
      />
      <DateSelectButton />
      <CommonButton title="검색" variant="standard" icon={<SearchOutlined />} icononly="true" onClick={() => formikProps.submitForm()} />
      <CommonButton title="공지" variant="outlined" onClick={() => btnActions.addLibrary()} icon={<FontAwesomeIcon icon={faPlus} />} />
    </>
  );
});

export default Toolbar;
