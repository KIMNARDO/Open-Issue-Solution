import { useStackBar } from 'layout/Dashboard/Drawer/StackBar/store/useStackBar';
import useAuth from './useAuth';
import { getUserAuth } from 'utils/commonUtils';

export const usePermission = () => {
  const { getActiveMenu } = useStackBar();
  const { user } = useAuth();

  const currnetViewPermAt = getUserAuth(user, 'viewPermAt', getActiveMenu()?.id ?? '');
  const currentModPermAt = getUserAuth(user, 'modPermAt', getActiveMenu()?.id ?? '');
  const currentExecPermAt = getUserAuth(user, 'execPermAt', getActiveMenu()?.id ?? '');
  const isSameWithUserId = (targetId: number) => user?.oid === targetId;
  const isUserIdIncluded = (target: number[]) => target.includes(user?.oid ?? -1);

  return {
    currnetViewPermAt,
    currentModPermAt,
    currentExecPermAt,
    isSameWithUserId,
    isUserIdIncluded
  };
};
