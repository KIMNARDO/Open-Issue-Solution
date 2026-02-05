import React, { useCallback, useMemo, useState } from 'react';
import BasicDialog, { ButtonOverrideProps } from './BasicDialog';
import { DialogProps } from '@mui/material';
import useAuth from 'hooks/useAuth';
import { commonNotification } from 'api/common/notification';
import { GroupAuthKey } from 'api/system/user/user.types';

export interface BasicDialogHookOptions {
  title?: string;
  cancelText?: string;
  confirmText?: string;
  description?: string;
  contentMaxHeight?: string | number;
}

export interface BasicDialogHookProps {
  children: React.ReactNode;
  handleConfirm?: () => void;
  options?: BasicDialogHookOptions;
  dialogProps?: Omit<DialogProps, 'fullScreen' | 'open' | 'onClose' | 'PaperComponent' | 'aria-labelledby'>;
  actionButtons?: boolean;
  overrideButtons?: ButtonOverrideProps[];
  closeCallback?: () => void;
}

/**
 * @example const { BasicDialog, handleOpen } = useBasicDialog();
 */
const useBasicDialog = (auth?: { authkey: GroupAuthKey; authTargetPath?: string }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    const authInfo = user?.groupAuthority?.find((f) => f.menuPath === window.location.pathname);

    if (auth && authInfo && authInfo[auth.authkey] === 'N') {
      commonNotification.warn('권한이 없습니다');
      return;
    }

    setOpen(() => true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(() => false);
  }, []);

  const dialog = useMemo(() => {
    return ({
      children,
      handleConfirm = handleClose,
      options = {},
      dialogProps = { maxWidth: 'xl' },
      actionButtons = false,
      overrideButtons,
      closeCallback
    }: BasicDialogHookProps) => (
      <BasicDialog {...{ children, handleConfirm, open, handleClose, options, dialogProps, actionButtons, overrideButtons, closeCallback }}>
        {children}
      </BasicDialog>
    );
  }, [handleClose, open]);

  return {
    BasicDialog: dialog,
    handleOpen,
    handleClose
  };
};

export default useBasicDialog;
