import { commonNotification } from 'api/common/notification';

export const handleServerError = (error: any) => {
  if (error && error.data) {
    commonNotification.error(error.data.message || 'Server Error Occured!!');
    return;
  }
  error && commonNotification.error(error.message || 'Server Error Occured!!');
};
