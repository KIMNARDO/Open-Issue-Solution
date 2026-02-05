import { Auth, ProductAuth, SearchAuthGroup } from './auth.types';
import AuthService from './authService';

type queryKeyNames = 'authGroupList' | 'authList' | 'productAuthList' | 'findAuthGroupMember' | 'findOtherGroupMember';
type mutateKeyNames =
  | 'registAuthGroup'
  | 'registGroupAuth'
  | 'authInitialize'
  | 'removeAuthGroup'
  | 'registAuthGroupMember'
  | 'removeAuthGroupMember'
  | 'modifyGroupAuth'
  | 'modifyAuthGroup'
  | 'modifyProductAuth';

export const queryKeys: Record<queryKeyNames, any> = {
  authGroupList: (params: SearchAuthGroup) => ['auth', 'group', 'list', params] as const,
  authList: (grpUid: number) => ['auth', 'list', grpUid] as const,
  productAuthList: (userUid: number) => ['auth', 'product', 'list', userUid] as const,
  findAuthGroupMember: (grpUid: number) => ['auth', 'group', 'member', grpUid] as const,
  findOtherGroupMember: (grpUid: number) => ['auth', 'other', 'group', 'member', grpUid] as const
};

const mutateKeys: Record<mutateKeyNames, any> = {
  registAuthGroup: ['auth', 'group', 'regist'] as const,
  registGroupAuth: ['auth', 'group', 'authority', 'regist'] as const,
  authInitialize: ['auth', 'initialize'] as const,
  removeAuthGroup: ['auth', 'remove'] as const,
  registAuthGroupMember: ['auth', 'group', 'member', 'regist'] as const,
  removeAuthGroupMember: ['auth', 'group', 'member', 'remove'] as const,
  modifyGroupAuth: ['auth', 'group', 'authority', 'modify'] as const,
  modifyAuthGroup: ['auth', 'group', 'save'] as const,
  modifyProductAuth: ['auth', 'product', 'save'] as const
};

export const queryOptions = {
  authGroupList: ({ params }: { params: SearchAuthGroup }) => ({
    queryKey: queryKeys.authGroupList(params),
    queryFn: () => AuthService.getAuthGroupList({ params })
  }),

  authList: ({ grpUid }: { grpUid: number }) => ({
    queryKey: queryKeys.authList(grpUid),
    queryFn: () => AuthService.findGroupAuth({ grpUid }),
    enabled: !!grpUid
  }),

  productAuthList: ({ userUid }: { userUid: number }) => ({
    queryKey: queryKeys.productAuthList(userUid),
    queryFn: () => AuthService.findProductAuth({ userUid }),
    enabled: !!userUid
  }),

  findAuthGroupMember: ({ grpUid }: { grpUid: number }) => ({
    queryKey: queryKeys.findAuthGroupMember(grpUid),
    queryFn: () => AuthService.findAuthGroupMember({ grpUid }),
    enabled: !!grpUid
  }),

  findOtherGroupMember: ({ grpUid }: { grpUid: number }) => ({
    queryKey: queryKeys.findOtherGroupMember(grpUid),
    queryFn: () => AuthService.findOtherGroupMember({ grpUid }),
    enabled: !!grpUid
  })
};

export const mutateOptions = {
  registAuthGroup: () => ({
    mutationKey: mutateKeys.registAuthGroup,
    mutationFn: ({ params }: { params: SearchAuthGroup }) => AuthService.registAuthGroup({ params })
  }),

  modifyAuthGroup: () => ({
    mutationKey: mutateKeys.modifyAuthGroup,
    mutationFn: ({ params }: { params: SearchAuthGroup }) => AuthService.modifyAuthGroup({ params })
  }),

  authInitialize: () => ({
    mutationKey: mutateKeys.authInitialize,
    mutationFn: ({ grpUid }: { grpUid: number }) => AuthService.authInitialize({ grpUid })
  }),

  removeAuthGroup: () => ({
    mutationKey: mutateKeys.removeAuthGroup,
    mutationFn: ({ grpUid }: { grpUid: number }) => AuthService.removeAuthGroup({ grpUid })
  }),

  registAuthGroupMember: () => ({
    mutationKey: mutateKeys.registAuthGroupMember,
    mutationFn: ({ grpUid, userUids }: { grpUid: number; userUids: number[] }) => AuthService.registAuthGroupMember({ grpUid, userUids })
  }),

  removeAuthGroupMember: () => ({
    mutationKey: mutateKeys.removeAuthGroupMember,
    mutationFn: ({ grpUid, userUids }: { grpUid: number; userUids: number[] }) => AuthService.removeAuthGroupMember({ grpUid, userUids })
  }),

  modifyGroupAuth: () => ({
    mutationKey: mutateKeys.modifyGroupAuth,
    mutationFn: ({ auths }: { auths: Auth[] }) => AuthService.modifyGroupAuth({ auths })
  }),

  registerGroupAuth: () => ({
    mutationKey: mutateKeys.registGroupAuth,
    mutationFn: ({ auth }: { auth: Auth }) => AuthService.registerGroupAuth({ auth })
  }),

  modifyProductAuth: () => ({
    mutationKey: mutateKeys.modifyProductAuth,
    mutationFn: ({ auths }: { auths: ProductAuth[] }) => AuthService.modifyProductAuth({ auths })
  })
};
