import { withSimpleSearchForm } from 'components/form/SimpleForm';
import { UserValidationType } from 'api/system/user/user.types';
import CommonButton from 'components/buttons/CommonButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faLock, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';
import useAuth from 'hooks/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { userMutationOptions } from 'api/system/user/user.query';

interface ToolbarProps {
  selectedUser: UserValidationType | undefined;
}

const Toolbar = withSimpleSearchForm<{}, ToolbarProps>(({ btnActions, selectedUser, modPermAt }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isExact = selectedUser?.oid === user?.oid;

  // if (!modPermAt) return null;
  return (
    <>
      {selectedUser && (
        <CommonButton
          title="저장"
          variant="contained"
          color="primary"
          icon={<FontAwesomeIcon icon={faSave} />}
          onClick={btnActions.save}
          loading={queryClient.isMutating({ mutationKey: userMutationOptions.update.mutationKey }) > 0}
        />
      )}
      {isExact && (
        <>
          <CommonButton
            title="비밀번호 초기화"
            variant="outlined"
            icon={<FontAwesomeIcon icon={faLock} />}
            onClick={() => btnActions.initializePassword()}
          />
          <CommonButton
            title="비밀번호 변경"
            variant="outlined"
            icon={<FontAwesomeIcon icon={faEdit} />}
            onClick={() => btnActions.changePassword()}
          />
        </>
      )}
      {modPermAt && (
        <>
          <CommonButton
            title={selectedUser ? '저장' : '등록'}
            variant="contained"
            color="primary"
            icon={<FontAwesomeIcon icon={faSave} />}
            onClick={() => btnActions.save()}
          />
          {selectedUser && (
            <CommonButton
              title="삭제"
              variant="outlined"
              color="error"
              icon={<FontAwesomeIcon icon={faTrash} />}
              onClick={() => btnActions.deleteUser()}
            />
          )}
        </>
      )}
    </>
  );
});

export default Toolbar;
