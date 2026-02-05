import { useMutation, useQuery } from '@tanstack/react-query';
import { mutationOptions, queryOptions } from './openIssue.query';
import { OpenissueComment, OpenissueGroup, OpenIssueSearch } from './openIssue.types';
import useConfig from 'hooks/useConfig';
import { useEffect } from 'react';

// query
export const useOpenIssueList = (issue: OpenIssueSearch) => {
  const { i18n } = useConfig();

  const result = useQuery(queryOptions.openIssues(issue, i18n));

  useEffect(() => {
    result.refetch();
  }, [i18n]);
  return result;
};

export const useOpenIssueGroupDetail = (oid: number) => useQuery(queryOptions.openIssueGroupDetail(oid));

export const useOpenIssueMember = (param: Partial<OpenissueGroup>) => useQuery(queryOptions.openIssueMember(param));

export const useOpenIssueCommentList = (openIssueOid: number) => useQuery(queryOptions.openIssueCommentList(openIssueOid));

export const useOpenIssueCommentDetail = (comment: OpenissueComment) => useQuery(queryOptions.openIssueCommentDetail(comment));

export const useOpenIssueGroupCategory = (openIssueCategoryOid: number) =>
  useQuery(queryOptions.openIssueGroupCategory(openIssueCategoryOid));

// mutation

export const useOpenIssueMenu = (type: string) => useQuery(queryOptions.openIssueMenu(type));

export const useOpenIssueCategory = () => useQuery(queryOptions.openIssueCategory());

export const useInsOpenIssue = () => useMutation(mutationOptions.insOpenIssue());

export const useUpdateOpenIssue = () => useMutation(mutationOptions.updateOpenIssue());

export const useRemoveOpenIssue = () => useMutation(mutationOptions.removeOpenIssue());

export const useRemoveOpenIssueBatch = () => useMutation(mutationOptions.removeOpenIssueBatch());

export const useUpdateGroup = () => useMutation(mutationOptions.updateGroup());

export const useUpdateGroupStatus = () => useMutation(mutationOptions.updateGroupStatus());

export const useRegistGroup = () => useMutation(mutationOptions.registGroup());

export const useRemoveGroup = () => useMutation(mutationOptions.removeGroup());

export const useRemoveComment = () => useMutation(mutationOptions.removeComment());

export const useRegistComment = () => useMutation(mutationOptions.registComment());

export const useUpdateComment = () => useMutation(mutationOptions.updateComment());
