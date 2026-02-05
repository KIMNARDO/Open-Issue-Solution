import { useMutation, useQuery } from '@tanstack/react-query';
import { mutateOptions, queryOptions } from './bbs.query';
import { BbsPostSearch } from './bbs.types';

export const useBbsList = (params: BbsPostSearch) => useQuery(queryOptions.bbsList(params));

export const useBbsDetail = (nttUid: number) => useQuery(queryOptions.bbsDetail(nttUid));

export const useRegistBbsPost = () => useMutation(mutateOptions.registBbsPost());

export const useModifyBbsPost = () => useMutation(mutateOptions.modifyBbsPost());

export const useRemoveBbs = () => useMutation(mutateOptions.removeBbs());
