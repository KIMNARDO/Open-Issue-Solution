import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CommonButton, { CommonButtonProps } from 'components/buttons/CommonButton';
import { confirmable, ConfirmDialogProps, createConfirmationCreater, createMountPoint, createReactTreeMounter } from 'react-confirm';

type CommonConfirmBtnType = Omit<CommonButtonProps, 'onClick'> & { hideBtn?: boolean };

interface CommonConfirmProps {
  title: string;
  msg: string;
  buttonProps?: {
    confirm?: CommonConfirmBtnType;
    cancel?: CommonConfirmBtnType;
  };
}

const defaultCancelProps: CommonConfirmBtnType = {
  title: '취소',
  variant: 'outlined',
  icon: <FontAwesomeIcon icon={faXmark} />
};

const defaultConfirmProps: CommonConfirmBtnType = {
  title: '확인',
  variant: 'contained',
  icon: <FontAwesomeIcon icon={faCheck} />
};

const CommonConfirm = confirmable(
  ({ title, msg, show, proceed, dismiss, buttonProps }: ConfirmDialogProps<CommonConfirmProps, boolean>) => {
    const cancelProps = buttonProps && buttonProps.cancel ? { ...buttonProps.cancel } : defaultCancelProps;
    const confirmProps = buttonProps && buttonProps.confirm ? { ...buttonProps.confirm } : defaultConfirmProps;

    return (
      <>
        <Dialog open={show} sx={{ '& .MuiDialog-paper': { minWidth: 500, maxWidth: '80%', maxHeight: 435 } }} onClose={dismiss}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>{msg}</DialogContent>
          <DialogActions>
            {!cancelProps.hideBtn && <CommonButton onClick={() => proceed(false)} {...cancelProps} />}
            {!confirmProps.hideBtn && <CommonButton onClick={() => proceed(true)} {...confirmProps} autoFocus />}
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

const mounter = createReactTreeMounter();

export const createConfirmation = createConfirmationCreater(mounter);
export const MountPoint = createMountPoint(mounter);

export const confirmation = createConfirmation(CommonConfirm);
