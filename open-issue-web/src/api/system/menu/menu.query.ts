import menuService from './MenuService';

type queryKeyNames = 'findByUserUid' | 'list';

const queryKeys: Record<queryKeyNames, any> = {
  findByUserUid: (userUid: number) => ['menu', 'findByUserUid', userUid] as const,
  list: ['menu', 'list'] as const
};

export const queryOptions = {
  findByUserUid: ({ userUid }: { userUid: number }) => ({
    queryKey: queryKeys.findByUserUid(userUid),
    queryFn: () => menuService.getMenuByUserUid({ userUid })
  }),
  list: () => ({
    queryKey: queryKeys.list,
    queryFn: () => menuService.getMenuList(),
    cacheTime: Infinity,
    staleTime: Infinity
  })
};
