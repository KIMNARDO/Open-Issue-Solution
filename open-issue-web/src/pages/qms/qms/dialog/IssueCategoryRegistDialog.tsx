import { Box } from '@mui/material';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import FormInput from 'components/input/FormInput';
import { forwardRef, useImperativeHandle, useRef } from 'react';
import { BasicDialogRef } from 'components/dialogs/BasicDialog';
import useAuth from 'hooks/useAuth';

interface IssueCategoryDialogProps {
  onConfirm: (values: { name: string }) => void;
}

const IssueCategoryRegistDialog = forwardRef<BasicDialogRef, IssueCategoryDialogProps>(({ onConfirm }, ref) => {
  const { BasicDialog, handleOpen, handleClose } = useBasicDialog();

  const { user } = useAuth();

  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => handleOpen(),
    close: () => handleClose()
  }));

  return (
    <BasicDialog
      actionButtons
      options={{
        title: '이슈카테고리 등록',
        confirmText: '등록',
        cancelText: '닫기'
      }}
      handleConfirm={() => {
        onConfirm({ name: inputRef.current?.value || '' });
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 3 }}>
        <FormInput name="parent" label="부서" variant="outlined" value={user?.departmentNm} disabled />
        <br />
        <FormInput inputRef={inputRef} name="name" label="이슈명" variant="outlined" />
      </Box>
    </BasicDialog>
  );
});

export default IssueCategoryRegistDialog;
