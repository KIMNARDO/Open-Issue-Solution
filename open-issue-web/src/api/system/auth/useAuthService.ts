import { useMutation, useQuery } from '@tanstack/react-query';
import { mutateOptions, queryOptions } from './auth.query';
import { SearchAuthGroup } from './auth.types';

const useAuthGroupList = (params: SearchAuthGroup) => useQuery(queryOptions.authGroupList({ params }));

const useAuthList = (grpUid: number) => useQuery(queryOptions.authList({ grpUid }));

const useProductAuthList = (userUid: number) => useQuery(queryOptions.productAuthList({ userUid }));

const useRegistAuthGroup = () => useMutation(mutateOptions.registAuthGroup());

const useModifyAuthGroup = () => useMutation(mutateOptions.modifyAuthGroup());

const useInitializeAuth = () => useMutation(mutateOptions.authInitialize());

const useRemoveAuthGroup = () => useMutation(mutateOptions.removeAuthGroup());

const useAuthGroupMember = (grpUid: number) => useQuery(queryOptions.findAuthGroupMember({ grpUid }));

const useOtherGroupMember = (grpUid: number) => useQuery(queryOptions.findOtherGroupMember({ grpUid }));

const useRegistAuthGroupMember = () => useMutation(mutateOptions.registAuthGroupMember());

const useRemoveAuthGroupMember = () => useMutation(mutateOptions.removeAuthGroupMember());

const useModifyGroupAuth = () => useMutation(mutateOptions.modifyGroupAuth());

const useRegistGroupAuth = () => useMutation(mutateOptions.registerGroupAuth());

const useModifyProductAuth = () => useMutation(mutateOptions.modifyProductAuth());

export {
  useAuthGroupList,
  useAuthList,
  useProductAuthList,
  useRegistAuthGroup,
  useModifyAuthGroup,
  useInitializeAuth,
  useRemoveAuthGroup,
  useAuthGroupMember,
  useOtherGroupMember,
  useRegistAuthGroupMember,
  useRemoveAuthGroupMember,
  useModifyGroupAuth,
  useRegistGroupAuth,
  useModifyProductAuth
};
