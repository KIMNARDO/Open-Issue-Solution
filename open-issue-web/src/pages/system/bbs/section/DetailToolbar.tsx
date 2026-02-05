import { faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CommonButton from 'components/buttons/CommonButton';
import { withSimpleSearchForm } from 'components/form/SimpleForm';

const BbsDetailToolbar = withSimpleSearchForm(({ formikProps }) => {
  return (
    <>
      <CommonButton
        title="저장"
        variant="contained"
        color="primary"
        icon={<FontAwesomeIcon icon={faSave} />}
        onClick={() => formikProps.submitForm()}
      />
      <CommonButton title="삭제" variant="outlined" color="error" icon={<FontAwesomeIcon icon={faTrash} />} onClick={() => {}} />
    </>
  );
});

export default BbsDetailToolbar;
