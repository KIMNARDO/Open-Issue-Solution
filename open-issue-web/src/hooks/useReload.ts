import { useStackBar } from 'layout/Dashboard/Drawer/StackBar/store/useStackBar';
import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';

const useReload = ({ menuId, queryClient, queryKeys }: { menuId: string; queryClient?: QueryClient; queryKeys?: string[][] }) => {
  const { getActiveMenu } = useStackBar();

  useEffect(() => {
    if (getActiveMenu()?.id === menuId) {
      queryKeys?.forEach((keys) => {
        queryClient?.invalidateQueries({ queryKey: keys });
      });
    }
  }, [getActiveMenu()]);
};

export default useReload;
