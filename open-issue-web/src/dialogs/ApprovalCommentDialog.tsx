import { CheckOutlined, UndoOutlined } from '@ant-design/icons';
import { Box, OutlinedInput } from '@mui/material';
import { commonNotification } from 'api/common/notification';
import CommonButton from 'components/buttons/CommonButton';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { useState } from 'react';

//결재 코멘트 입력 dialog
export type ApprovalCommentType = 'pass' | 'reject';

interface ApprovalDialogProps {
  type: ApprovalCommentType;
  BasicDialog: ReturnType<typeof useBasicDialog>['BasicDialog'];
  handleClose: ReturnType<typeof useBasicDialog>['handleClose'];
  onConfirm: (comment: string) => void;
}
const ApprovalCommentDialog = ({ type, BasicDialog, handleClose, onConfirm }: ApprovalDialogProps) => {
  const [comment, setComment] = useState('');

  const handleConfirm = () => {
    if (!comment || comment.length < 1) {
      commonNotification.error('코멘트를 입력해주세요');
      return;
    }
    onConfirm(comment);
    handleClose();
  };

  return (
    <BasicDialog
      options={{
        title: type === 'pass' ? '결재 승인' : '결재 반려'
      }}
    >
      <Box sx={{ display: 'flex', my: 1, justifyContent: 'space-between', gap: 2, width: '20vw' }}>
        <OutlinedInput
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          name="comment"
          placeholder="결재 코멘트를 입력하세요"
          fullWidth
        />
        <CommonButton
          title={type === 'pass' ? '승인' : '반려'}
          icon={type === 'pass' ? <CheckOutlined /> : <UndoOutlined />}
          variant="outlined"
          color={type === 'pass' ? 'primary' : 'error'}
          onClick={handleConfirm}
        />
      </Box>
    </BasicDialog>
  );
};

export default ApprovalCommentDialog;
