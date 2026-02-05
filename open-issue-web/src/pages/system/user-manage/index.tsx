import { Box, Divider, Typography } from '@mui/material';
import SlideTree from './section/SideTree';
import { createContext, useEffect, useMemo, useRef, useState } from 'react';
import Toolbar from './section/SearchBar';
import { FormikProps } from 'formik';
import { useDeleteUser, useInitializeUserPassword, useOrganization, useUserById } from 'api/system/user/useUserService';
import { Organization, User, UserPartialType, UserValidationType, userSchema } from 'api/system/user/user.types';
import MainForm from './section/MainForm';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import ChangePassword from '../dialog/user-information/ChangePassword';
import { confirmation } from 'components/confirm/CommonConfirm';
import { commonNotification } from 'api/common/notification';
import { handleServerError } from 'utils/error';
import useAuth from 'hooks/useAuth';
import { searchTreeNodes, SimpleTreeViewRef, TreeNode } from 'components/treeView/SimpleTree';
import { useMutation } from '@tanstack/react-query';
import { userMutationOptions } from 'api/system/user/user.query';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';
import AddUserDialog from './dialog/AddUserDialog';
import TreeLayout from 'layout/Tree';

export interface CurrentGroup {
  departmentOID: string;
  departmentNm: string;
}

const initOrganizationNode = (org: Organization): TreeNode => {
  return {
    id: org.key,
    label: org.title,
    data: org.data,
    children: (org.people ?? [])
      .map<TreeNode>((child) =>
        initOrganizationNode({ key: child.oid.toString(), title: child.name, people: [], data: child, children: [] })
      )
      .concat((org.children ?? []).map<TreeNode>((child) => initOrganizationNode(child)))
  };
};

interface UserManageContextType {
  addUser: () => void;
  handleSlideTreeSearch: (values: UserPartialType) => void;
}

export const UserManageContext = createContext<UserManageContextType>({
  addUser: () => {},
  handleSlideTreeSearch: () => {}
});

const UserManage = () => {
  const [checked, setChecked] = useState(true);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [searchParam, setSearchParam] = useState<UserPartialType>({});
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [currentGroup, setCurrentGroup] = useState<CurrentGroup | undefined>();

  const userDetailDialogRef = useRef<BasicDialogRef>(null);
  const treeRef = useRef<SimpleTreeViewRef>(null);

  const { logout } = useAuth();

  // const { data, refetch } = useUsers(searchParam);
  // 조직도 데이터
  const { data: organization, isFetching } = useOrganization();
  const initOrganizationData = useMemo(() => {
    if (!organization) return [];
    return [initOrganizationNode(organization)];
  }, [organization]);

  useEffect(() => {
    if (organization) {
      setTreeData(initOrganizationData);
    }
  }, [organization]);

  const { data: userDetail, refetch: refetchUserDetail } = useUserById(Number(selectedUserId));

  const { mutate: deleteUser } = useDeleteUser();
  const { mutate: iniializePassword } = useInitializeUserPassword();
  // const { mutate: registAuthGroupMember } = useRegistAuthGroupMember();

  const { mutate: updateUser } = useMutation(userMutationOptions.update);
  const { mutate: createUser } = useMutation(userMutationOptions.create);

  const formRef = useRef<FormikProps<UserValidationType>>(null);

  const {
    BasicDialog: PasswordChangeDialog,
    handleOpen: handleOpenPasswordChangeDialog,
    handleClose: handleClosePasswordChangeDialog
  } = useBasicDialog();

  const handleSlideTreeSearch = (values: UserPartialType) => {
    setSearchParam(values);
    if (values.name) {
      treeRef.current?.expandAll();
    } else {
      treeRef.current?.expandById('1');
    }
  };

  const handleSlideTreeSelect = (id: string) => {
    setSelectedUserId(id);
  };

  // const addAuthGroupMember = (userUid: number, grpUid: number) => {
  //   registAuthGroupMember(
  //     { userUids: [userUid], grpUid: Number(grpUid) },
  //     {
  //       onSuccess: () => {
  //         commonNotification.success('저장되었습니다');
  //       },
  //       onError: (error) => handleServerError(error)
  //     }
  //   );
  // };

  const handleFormSubmit = (values: User) => {
    updateUser(values, {
      onSuccess: () => {
        commonNotification.success('저장되었습니다');
        refetchUserDetail();
      },
      onError: (error) => handleServerError(error)
    });
  };

  const handleCreateUser = (values: User) => {
    createUser(values, {
      onSuccess: () => {
        commonNotification.success('저장되었습니다');
      },
      onError: (error) => handleServerError(error)
    });
  };

  const handlePasswordInitialize = async () => {
    if (!selectedUserId) {
      commonNotification.error('초기화할 사용자를 선택해주세요');
      return;
    }
    const result = await confirmation({
      title: '비밀번호 초기화',
      msg: '비밀번호를 초기화 하시겠습니까?\n초기화 하는 경우 로그아웃 되며 다시 로그인 해야합니다.'
    });

    if (!result) {
      return;
    }

    // TODO: initializePassword
    iniializePassword(
      { userUid: Number(selectedUserId) },
      {
        onSuccess: async () => {
          commonNotification.success('초기화되었습니다');
          logout();
        },
        onError: (error) => handleServerError(error)
      }
    );
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) {
      commonNotification.error('삭제할 사용자를 선택해주세요');
      return;
    }
    const result = await confirmation({
      title: '사용자 삭제',
      msg: '사용자를 삭제하시겠습니까?'
    });

    if (!result) {
      return;
    }

    deleteUser(
      { userUid: Number(selectedUserId) },
      {
        onSuccess: () => {
          commonNotification.success('삭제되었습니다');
          formRef.current?.resetForm();
        },
        onError: (error) => handleServerError(error)
      }
    );
  };

  const addUser = () => {
    if (!treeRef.current?.getSelectedItem()) {
      commonNotification.warn('조직 또는 사용자를 선택해주세요');
      return;
    }
    if (treeRef?.current.isTopLevelSelected()) {
      commonNotification.warn('회사에는 사용자를 등록할 수 없습니다.');
      return;
    }
    userDetailDialogRef.current?.open();
    const selectedNode = treeRef.current?.getSelectedItem();
    if (!selectedNode) {
      setCurrentGroup(undefined);
      return;
    }
    if (selectedNode && selectedNode?.data) {
      setCurrentGroup({
        departmentOID: selectedNode.data.departmentOID,
        departmentNm: selectedNode.data.departmentNm || ''
      });
      return;
    }
    setCurrentGroup({
      departmentOID: selectedNode.id,
      departmentNm: selectedNode.label
    });
  };

  const toolbarActions = {
    save: () => {
      formRef.current?.submitForm();
    },
    changePassword: () => {
      handleOpenPasswordChangeDialog();
    },
    initializePassword: () => {
      handlePasswordInitialize();
    },
    deleteUser: () => {
      handleDeleteUser();
    }
  };

  useEffect(() => {
    if (userDetail) {
      formRef.current?.resetForm({
        values: {
          ...userDetail,
          isUse: userDetail.isUse ?? 0,
          check2FA: userDetail.check2FA ?? 0
        } as UserValidationType
      });
    } else {
      formRef.current?.resetForm({
        values: {
          isUse: 0,
          check2FA: 0
        } as UserValidationType
      });
    }
  }, [userDetail]);

  const memoTree = useMemo(() => {
    return (
      <SlideTree
        ref={treeRef}
        checked={checked}
        position="right"
        fabPosition={{ bottom: 16, left: 16 }}
        fabSize="medium"
        slideWidth="22vw"
        slideHeight="100%"
        setChecked={setChecked}
        data={searchTreeNodes(treeData, searchParam.name ?? '')}
        onSelect={handleSlideTreeSelect}
        isLoading={isFetching}
        options={{
          groupIcon: <FontAwesomeIcon icon={faUsers} style={{ fontSize: '18px' }} />,
          leafIcon: <FontAwesomeIcon icon={faUser} style={{ fontSize: '18px' }} />
        }}
      />
    );
  }, [treeData, checked, searchParam, isFetching]);

  return (
    <UserManageContext.Provider value={{ addUser, handleSlideTreeSearch }}>
      <TreeLayout tree={memoTree}>
        <Box sx={{ height: '100%', p: 1, flex: 3 }}>
          {/* toolbar */}
          <Toolbar
            title="사용자 정보"
            onSubmit={() => {}}
            initialValues={{}}
            btnActions={toolbarActions}
            selectedUser={userDetail as UserValidationType}
          />
          <Divider />
          {/* form */}
          {userDetail ? (
            <MainForm
              ref={formRef}
              onSubmit={handleFormSubmit}
              initialValues={{}}
              selectedUser={userDetail as UserValidationType}
              validationSchema={userSchema}
            />
          ) : (
            <>
              <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                <Typography variant="body1" color="textSecondary">
                  사용자를 선택해주세요.
                </Typography>
              </Box>
            </>
          )}
        </Box>
        <PasswordChangeDialog
          options={{
            title: '암호 변경',
            description: '암호 변경 시 로그아웃되며 변경된 암호로 다시 로그인 해야합니다.'
          }}
        >
          <ChangePassword handleClose={() => handleClosePasswordChangeDialog()} />
        </PasswordChangeDialog>
        <AddUserDialog ref={userDetailDialogRef} onSubmit={handleCreateUser} currentGroup={currentGroup} />
      </TreeLayout>
    </UserManageContext.Provider>
  );
};

export default UserManage;
