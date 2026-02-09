import { faCheck, faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@mui/material';
import { commonNotification } from 'api/common/notification';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { useEffect } from 'react';
import { useBlocker } from 'react-router';
import { useIntl } from 'react-intl';

export const useCustomBlocker = (predicate: () => boolean, saveCallback?: (onSuccess: () => void) => void) => {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => predicate() && currentLocation.pathname !== nextLocation.pathname);
  const { formatMessage } = useIntl();

  const { BasicDialog, handleClose, handleOpen } = useBasicDialog();

  useEffect(() => {
    blocker.state === 'blocked' && handleOpen();
  }, [blocker.state]);

  const closeBtnHandler = () => {
    blocker.reset && blocker.reset();
    handleClose();
  };

  const BlockDialog = () => (
    <BasicDialog
      options={{
        title: formatMessage({ id: 'dialog-page-move' }),
        confirmText: formatMessage({ id: 'btn-yes' }),
        cancelText: formatMessage({ id: 'btn-no' })
      }}
      overrideButtons={
        saveCallback
          ? [
              {
                btnLabel: formatMessage({ id: 'btn-yes' }),
                btnOptions: { color: 'primary', variant: 'outlined', endIcon: <FontAwesomeIcon icon={faCheck} /> },
                btnAction: () => blocker.proceed && blocker.proceed()
              },
              {
                btnLabel: formatMessage({ id: 'btn-no' }),
                btnOptions: { color: 'primary', variant: 'outlined', endIcon: <FontAwesomeIcon icon={faXmark} /> },
                btnAction: closeBtnHandler
              },
              {
                btnLabel: formatMessage({ id: 'btn-save-and-move' }),
                btnOptions: { color: 'primary', variant: 'contained', endIcon: <FontAwesomeIcon icon={faSave} /> },
                btnAction: () => {
                  saveCallback(() => {
                    handleClose();
                    commonNotification.success(formatMessage({ id: 'msg-saved' }));
                    blocker.proceed && blocker.proceed();
                  });
                }
              }
            ]
          : [
              {
                btnLabel: formatMessage({ id: 'btn-yes' }),
                btnOptions: { color: 'primary', variant: 'outlined', endIcon: <FontAwesomeIcon icon={faCheck} /> },
                btnAction: () => blocker.proceed && blocker.proceed()
              },
              {
                btnLabel: formatMessage({ id: 'btn-no' }),
                btnOptions: { color: 'primary', variant: 'outlined', endIcon: <FontAwesomeIcon icon={faXmark} /> },
                btnAction: closeBtnHandler
              }
            ]
      }
      closeCallback={() => {
        blocker.reset && blocker.reset();
      }}
    >
      <Box display={'flex'} justifyContent={'start'} alignItems={'center'}>
        <Typography sx={{ py: 2, mx: 10 }}>{formatMessage({ id: 'msg-confirm-unsaved' })}</Typography>
      </Box>
    </BasicDialog>
  );

  return { BlockDialog };
};
