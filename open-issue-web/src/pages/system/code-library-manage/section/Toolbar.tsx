import CommonButton from 'components/buttons/CommonButton';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave } from '@fortawesome/free-solid-svg-icons';
import { TextField } from '@mui/material';
import { LibrarySearch } from 'api/system/library/library.types';
import { SearchOutlined } from '@ant-design/icons';

const Toolbar = withSimpleSearchForm<LibrarySearch>(({ btnActions, formikProps, modPermAt }) => {
  return (
    <>
      <TextField
        name="searchWord"
        placeholder="검색어를 입력해주세요."
        value={formikProps.values.searchWord}
        onChange={formikProps.handleChange}
      />
      <CommonButton title="검색" variant="standard" icon={<SearchOutlined />} icononly="true" onClick={() => formikProps.submitForm()} />
      {modPermAt && (
        <>
          <CommonButton title="코드" variant="contained" onClick={() => btnActions.addLibrary()} icon={<FontAwesomeIcon icon={faPlus} />} />
          <CommonButton
            title="저장"
            variant="contained"
            onClick={() => btnActions.saveLibrary()}
            icon={<FontAwesomeIcon icon={faSave} />}
          />
        </>
      )}
    </>
  );
});

export default Toolbar;
