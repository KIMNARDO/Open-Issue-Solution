import { SearchOutlined } from '@ant-design/icons';
import { InputAdornment, TextField } from '@mui/material';
import { IconButton } from '@mui/material';
import { Box } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { SelectboxType } from 'components/select/selectbox.types';
import { TreeNode } from 'components/treeView/SimpleTree';
import UserSelectDialog from 'dialogs/UserSelectDialog';

/**
 * @description editor 없이 스위치를 사용하기 위한 renderer
 * @example
 * - 컬럼정의 중 cellRenderer에 해당 컴포넌트를 지정하여 사용
 * - cellRenderer: DirectSwitchRenderer,
 * - 추가적인 속성은 컬럼정의의 context를 통해서 전달
 */
const UserSearchRenderer = ({ value, api, data, colDef, users }: CustomCellRendererProps & { users: SelectboxType[] }) => {
  const { BasicDialog, handleOpen, handleClose } = useBasicDialog();

  const handleUserSelect = (treeNodes: TreeNode[]) => {
    if (!data) return;
    data[colDef?.field!] = treeNodes.map((el) => el.data?.oid);
    data.isUpdated = true;

    api.applyTransaction({
      update: [data]
    });
  };

  const formatValue = (value?: any) => {
    if (!value) return '';
    if (typeof value === 'string') {
      return value;
    } else if (Array.isArray(value)) {
      return value.map((el: number) => users.find((user) => user.value === el.toString())?.label).join(', ');
    } else {
      return 'error occured';
    }
  };

  return (
    <Box display={'flex'} alignItems={'center'} justifyContent={'center'} height={'100%'}>
      <TextField
        // helperText={helperText}
        style={{ minWidth: 15, width: '100%' }}
        variant={'standard'}
        value={formatValue(value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleOpen}>
                <SearchOutlined />
              </IconButton>
            </InputAdornment>
          ),
          readOnly: true,
          style: {
            justifyContent: 'space-between',
            backgroundColor: 'transparent',
            fontSize: '13px'
          }
        }}
      />
      <UserSelectDialog
        BasicDialog={BasicDialog}
        handleClose={handleClose}
        onConfirm={handleUserSelect}
        multiSelect={true}
        defaultCheckedKeys={Array.isArray(value) ? value : undefined}
      />
    </Box>
  );
};

export default UserSearchRenderer;
