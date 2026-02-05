import useBasicDialog, { BasicDialogHookProps } from 'components/dialogs/useBasicDialog';
import UserInformation, { UserInformationRef } from './UserInformation';
import { useCallback, useRef } from 'react';
//import { useModifyUser } from 'api/system/user/useUserService';
//import { commonNotification } from 'api/common/notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import ChangePassword from './ChangePassword';
//import { handleServerError } from 'utils/error';
//import { UserValidationType } from 'api/system/user/user.types';

interface UserInfoDialogProps {
  BasicDialog: (props: BasicDialogHookProps) => JSX.Element;
}

const UserInfoDialog = ({ BasicDialog }: UserInfoDialogProps) => {
  const userInformationRef = useRef<UserInformationRef>(null);

  const { BasicDialog: ChangePasswordDialog, handleOpen: changePasswordOpen, handleClose: changePasswordClose } = useBasicDialog();

  //const { mutate: modifyUser } = useModifyUser();

  //const [submitClick, setSubmitClick] = useState<boolean>(false);

  /*const handleSubmit = () => {
    const data = userInformationRef.current?.getUserData() as UserValidationType;

    if (!data) {
      return;
    }

    modifyUser(
      { data },
      {
        onSuccess() {
          commonNotification.success('저장되었습니다.');

          setSubmitClick(true);
        },
        onError(error) {
          handleServerError(error);
        }
      }
    );
  };*/

  const handleModalCloseCallback = useCallback(() => {
    //if (submitClick) {
    window.location.reload();
    //}
  }, []);

  return (
    <>
      <BasicDialog
        options={{ title: '내 정보', description: '초기 비밀번호는 관리자에 문의 바랍니다' }}
        actionButtons={true}
        overrideButtons={[
          {
            btnLabel: '비밀번호 변경',
            btnAction: changePasswordOpen,
            btnOptions: { variant: 'outlined', startIcon: <FontAwesomeIcon icon={faEdit} /> }
          }
          //{ btnLabel: '저장', btnAction: handleSubmit, btnOptions: { variant: 'contained', startIcon: <FontAwesomeIcon icon={faSave} /> } }
        ]}
        closeCallback={handleModalCloseCallback}
      >
        <UserInformation ref={userInformationRef} />
      </BasicDialog>
      <ChangePasswordDialog options={{ title: '비밀번호 변경' }}>
        <ChangePassword handleClose={changePasswordClose} />
      </ChangePasswordDialog>
    </>
  );
};

export default UserInfoDialog;
