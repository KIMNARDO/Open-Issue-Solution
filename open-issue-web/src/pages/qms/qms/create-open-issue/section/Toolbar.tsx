import { withSimpleSearchForm } from 'components/form/SimpleForm';
import CommonButton from 'components/buttons/CommonButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faSave } from '@fortawesome/free-solid-svg-icons';
import { useIntl } from 'react-intl';

const Toolbar = withSimpleSearchForm(({ btnActions }) => {
  const { formatMessage } = useIntl();
  return (
    <>
      <CommonButton
        title={formatMessage({ id: 'btn-list' })}
        variant="outlined"
        color="primary"
        icon={<FontAwesomeIcon icon={faList} />}
        onClick={btnActions.list}
      />
      <CommonButton
        title={formatMessage({ id: 'btn-regist' })}
        variant="contained"
        color="primary"
        icon={<FontAwesomeIcon icon={faSave} />}
        onClick={btnActions.save}
      />
    </>
  );
});

export default Toolbar;
