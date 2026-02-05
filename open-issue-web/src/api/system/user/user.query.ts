import { User, UserPartialType, UserValidationType } from './user.types';
import userService from './UserService';

type UserQueryName = 'list' | 'searchList' | 'findById' | 'findByUid' | 'getDeptUsers' | 'getDepts' | 'organization';
type UserMutateName = 'merge' | 'create' | 'modify' | 'delete' | 'inactive' | 'modifyPassword' | 'initializePassword';

export const queryKeys: Record<UserQueryName, any> = {
  list: (params: UserPartialType) => ['users', params] as const,
  searchList: (params: UserPartialType) => ['users', 'search', params] as const,
  findById: (userId: string) => ['current', 'user', userId] as const,
  findByUid: (userUid: number) => ['user', 'detail', userUid] as const,
  getDeptUsers: () => ['users', 'dept', 'member'] as const,
  getDepts: () => ['users', 'dept', 'list'] as const,
  organization: () => ['organization'] as const
};

export const mutateKeys: Record<UserMutateName, any> = {
  merge: ['user', 'merge'] as const,
  create: ['user', 'create'] as const,
  modify: ['user', 'modify'] as const,
  delete: ['user', 'delete'] as const,
  inactive: ['user', 'inactive'] as const,
  modifyPassword: ['user', 'modifyPassword'] as const,
  initializePassword: ['user', 'initializePassword'] as const
};

export const userQueryOptions = {
  list: ({ params }: { params: UserPartialType }) => ({
    queryKey: queryKeys.list(params),
    queryFn: () => userService.getUsers({ params })
  }),
  searchList: ({ params }: { params: UserPartialType }) => ({
    queryKey: queryKeys.searchList(params),
    queryFn: () => userService.getUsers({ params }),
    staleTime: 5 * 60 * 1000
  }),

  findById: ({ oid }: { oid: number }) => ({
    queryKey: queryKeys.findById(oid),
    queryFn: () => userService.getUserById({ oid }),
    enabled: !!oid && oid > 0
  }),

  getOrganization: () => ({
    queryKey: queryKeys.organization(),
    queryFn: () => userService.getOrganization()
  })
};

export const userMutationOptions = {
  update: {
    mutationKey: ['updateUser'],
    mutationFn: (data: User) => userService.updateUser(data)
  },
  remove: {
    mutationKey: ['removeUser'],
    mutationFn: (userUid: number) => userService.removeUser(userUid)
  },
  create: {
    mutationKey: ['registUser'],
    mutationFn: (data: User) => userService.registUser(data)
  }
};

/**
 * @deprecated
 */
const queryOptions = {
  findByUid: ({ userUid }: { userUid: number }) => ({
    queryKey: queryKeys.findByUid(userUid),
    queryFn: () => userService.getUserByUid({ userUid })
  }),

  getDeptUsers: () => ({
    queryKey: queryKeys.getDeptUsers(),
    queryFn: () => userService.getDeptUsers()
  }),

  getDepts: () => ({
    queryKey: queryKeys.getDepts(),
    queryFn: () => userService.getDepts()
  }),

  merge: () => ({
    mutationKey: mutateKeys.merge,
    mutationFn: ({ data }: { data: UserValidationType[] }) => userService.mergeUser({ data })
  }),

  create: () => ({
    mutationKey: mutateKeys.create,
    mutationFn: ({ data }: { data: UserValidationType }) => userService.createUser({ data })
  }),

  modify: () => ({
    mutationKey: mutateKeys.modify,
    mutationFn: ({ data }: { data: UserValidationType }) => userService.modifyUser({ data })
  }),

  delete: () => ({
    mutationKey: mutateKeys.delete,
    mutationFn: ({ userUid }: { userUid: number }) => userService.deleteUser({ userUid })
  }),

  inactive: () => ({
    mutationKey: mutateKeys.inactive,
    mutationFn: ({ userUid }: { userUid: number }) => userService.inactiveUser({ userUid })
  }),

  modifyPassword: () => ({
    mutationKey: mutateKeys.modifyPassword,
    mutationFn: ({ userUid, oldPassword, newPassword }: { userUid: number; oldPassword: string; newPassword: string }) =>
      userService.modifyUserPassword({ userUid, oldPassword, newPassword })
  }),

  initializePassword: () => ({
    mutationKey: mutateKeys.initializePassword,
    mutationFn: ({ userUid }: { userUid: number }) => userService.initializeUserPassword({ userUid })
  })
};

export default queryOptions;
