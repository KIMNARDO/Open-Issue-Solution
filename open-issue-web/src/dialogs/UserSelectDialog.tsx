import { Box, TextField, useTheme } from '@mui/material';
import CommonButton from 'components/buttons/CommonButton';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { withSimpleSearchForm } from 'components/form/SimpleForm';
import { CheckOutlined, SearchOutlined } from '@ant-design/icons';
import { Divider } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useOrganization } from 'api/system/user/useUserService';
import { Organization, UserPartialType } from 'api/system/user/user.types';
import SimpleTree, { searchTreeNodes, SimpleTreeViewRef, TreeNode } from 'components/treeView/SimpleTree';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUsers } from '@fortawesome/free-solid-svg-icons';

const initOrganizationNode = (org: Organization): TreeNode => {
  return {
    id: org.key,
    label: org.title,
    data: org.data,
    children: (org.people ?? [])
      .map<TreeNode>((child) => initOrganizationNode({ key: child.oid.toString(), title: child.name, data: child }))
      .concat((org.children ?? []).map<TreeNode>((child) => initOrganizationNode(child)))
  };
};

const TreeSearchBar = withSimpleSearchForm<UserPartialType>(({ formikProps, btnActions }) => {
  return (
    <>
      <TextField
        name="name"
        placeholder="검색어를 입력해주세요"
        value={formikProps.values.name}
        onChange={formikProps.handleChange}
        onBlur={formikProps.handleBlur}
        variant="outlined"
        sx={{ flex: '1 0 auto' }}
      />
      <CommonButton title="검색" variant="outlined" onClick={() => formikProps.submitForm()} icononly="true" icon={<SearchOutlined />} />
      <CommonButton title="선택" variant="contained" color="primary" icon={<CheckOutlined />} onClick={btnActions.select} />
    </>
  );
});

interface UserSelectDialogProps {
  BasicDialog: ReturnType<typeof useBasicDialog>['BasicDialog'];
  handleClose: ReturnType<typeof useBasicDialog>['handleClose'];
  onConfirm: (data: TreeNode[]) => void;
  multiSelect?: boolean;
  defaultCheckedKeys?: string[];
}

const UserSelectDialog = ({ BasicDialog, handleClose, onConfirm, multiSelect = false, defaultCheckedKeys = [] }: UserSelectDialogProps) => {
  const { data: organization } = useOrganization();
  const initOrganizationData = useMemo(() => {
    if (!organization) return [];
    return [initOrganizationNode(organization)];
  }, [organization]);

  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [searchParam, setSearchParam] = useState<UserPartialType>({});

  const treeRef = useRef<SimpleTreeViewRef>(null);

  const { palette } = useTheme();

  const handleConfirm = () => {
    const result = multiSelect ? treeRef.current?.getCheckedLeaves() : treeRef.current?.getSelectedItem();
    onConfirm(!result ? [] : Array.isArray(result) ? result : [result]);
    setSearchParam({});
    handleClose();
  };

  const btnActions = {
    select: handleConfirm
  };

  useEffect(() => {
    setTreeData(initOrganizationData);
  }, [initOrganizationData]);

  return (
    <>
      <BasicDialog
        options={{
          title: '사용자 선택',
          description: '사용자를 선택해주세요.'
        }}
        closeCallback={() => {
          setSearchParam({});
        }}
      >
        <Box sx={{ border: `1px solid ${palette.divider}`, width: '100%', height: '100%', p: 1, flex: 1, mt: 1 }}>
          <TreeSearchBar
            btnActions={btnActions}
            initialValues={{}}
            direction="end"
            useTitle={false}
            onSubmit={(values) => {
              setSearchParam(values);
              if (!values.name) {
                treeRef.current?.expandById('1');
              } else {
                treeRef.current?.expandAll();
              }
            }}
          />
          <Divider color={palette.divider} />
          <Box sx={{ width: '20vw', height: '40vh', overflow: 'auto' }}>
            <SimpleTree
              ref={treeRef}
              data={searchTreeNodes(treeData, searchParam.name || '')}
              expandAction="doubleClick"
              onSelect={() => {}}
              useCheck={multiSelect}
              options={{
                groupIcon: <FontAwesomeIcon icon={faUsers} style={{ fontSize: '18px', color: 'primary' }} />,
                leafIcon: <FontAwesomeIcon icon={faUser} style={{ fontSize: '18px', color: 'primary' }} />
              }}
              isLeaf={(item) => !!item.data}
            />
          </Box>
        </Box>
      </BasicDialog>
    </>
  );
};

export default UserSelectDialog;
