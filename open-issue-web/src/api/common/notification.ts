import { Slide } from '@mui/material';
import { enqueueSnackbar, OptionsObject } from 'notistack';

const defaultNotification: OptionsObject = {
  TransitionComponent: Slide,
  TransitionProps: { direction: 'down' },
  transitionDuration: { enter: 250, exit: 400 },
  anchorOrigin: { horizontal: 'center', vertical: 'top' },
  autoHideDuration: 2500
};

/**
 * @param message 표시할 메세지
 * @description 공통 알림
 * @example - 사용법
 * commonNotification.error('대공정을 선택해주세요');
 *
 */
export const commonNotification = {
  success: (message: string) => enqueueSnackbar(message, { ...defaultNotification, variant: 'success' }),
  error: (message: string) => enqueueSnackbar(message, { ...defaultNotification, variant: 'error' }),
  info: (message: string) => enqueueSnackbar(message, { ...defaultNotification, variant: 'info' }),
  warn: (message: string) => enqueueSnackbar(message, { ...defaultNotification, variant: 'warning' })
};
