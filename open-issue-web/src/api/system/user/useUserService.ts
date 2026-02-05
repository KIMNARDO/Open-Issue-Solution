import { useMutation, useQuery } from '@tanstack/react-query';
import queryOptions, { userQueryOptions } from './user.query';
import { UserPartialType } from './user.types';

export function useUsers(params: UserPartialType) {
  return useQuery(userQueryOptions.list({ params }));
}

export function useSearchUsers(params: UserPartialType) {
  return useQuery(userQueryOptions.searchList({ params }));
}

export function useGetDeptUsers() {
  return useQuery(queryOptions.getDeptUsers());
}

export function useGetDepts() {
  return useQuery(queryOptions.getDepts());
}

export function useOrganization() {
  return useQuery(userQueryOptions.getOrganization());
}

export function useUserById(oid: number) {
  return useQuery(userQueryOptions.findById({ oid }));
}

export function useUserByUid(userUid: number) {
  return useQuery(queryOptions.findByUid({ userUid }));
}

export function useMergeUser() {
  return useMutation(queryOptions.merge());
}

export function useCreateUser() {
  return useMutation(queryOptions.create());
}

export function useModifyUser() {
  return useMutation(queryOptions.modify());
}

export function useDeleteUser() {
  return useMutation(queryOptions.delete());
}

export function useInactiveUser() {
  return useMutation(queryOptions.inactive());
}

export function useModifyUserPassword() {
  return useMutation(queryOptions.modifyPassword());
}

export function useInitializeUserPassword() {
  return useMutation(queryOptions.initializePassword());
}
