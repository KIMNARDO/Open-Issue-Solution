import { faCheck, faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Typography } from '@mui/material';
import { commonNotification } from 'api/common/notification';
import useBasicDialog from 'components/dialogs/useBasicDialog';
import { useEffect } from 'react';
import { useBlocker } from 'react-router';

export const useCustomBlocker = (predicate: () => boolean, saveCallback?: (onSuccess: () => void) => void) => {
  const blocker = useBlocker(({ currentLocation, nextLocation }) => predicate() && currentLocation.pathname !== nextLocation.pathname);

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
        title: '페이지 이동',
        confirmText: '예',
        cancelText: '아니오'
      }}
      overrideButtons={
        saveCallback
          ? [
              {
                btnLabel: '예',
                btnOptions: { color: 'primary', variant: 'outlined', endIcon: <FontAwesomeIcon icon={faCheck} /> },
                btnAction: () => blocker.proceed && blocker.proceed()
              },
              {
                btnLabel: '아니오',
                btnOptions: { color: 'primary', variant: 'outlined', endIcon: <FontAwesomeIcon icon={faXmark} /> },
                btnAction: closeBtnHandler
              },
              {
                btnLabel: '저장 후 이동',
                btnOptions: { color: 'primary', variant: 'contained', endIcon: <FontAwesomeIcon icon={faSave} /> },
                btnAction: () => {
                  saveCallback(() => {
                    handleClose();
                    commonNotification.success('저장되었습니다');
                    blocker.proceed && blocker.proceed();
                  });
                }
              }
            ]
          : [
              {
                btnLabel: '예',
                btnOptions: { color: 'primary', variant: 'outlined', endIcon: <FontAwesomeIcon icon={faCheck} /> },
                btnAction: () => blocker.proceed && blocker.proceed()
              },
              {
                btnLabel: '아니오',
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
        <Typography sx={{ py: 2, mx: 10 }}>수정중인 데이터가 있습니다. 진행하시겠습니까?</Typography>
      </Box>
    </BasicDialog>
  );

  return { BlockDialog };
};
