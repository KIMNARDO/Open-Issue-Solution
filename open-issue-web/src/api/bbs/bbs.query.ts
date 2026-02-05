import { BlobPayload } from 'types/commonUtils.types';
import { BbsPost, BbsPostSearch } from './bbs.types';
import bbsService from './bbsService';

type QueryKeyNames = 'bbsList' | 'bbsDetail';

type MutateKeyNames = 'registBbsPost' | 'modifyBbsPost' | 'removeBbs';

export const queryKeys: Record<QueryKeyNames, any> = {
  bbsList: (params: BbsPostSearch) => ['bbs', 'list', params] as const,
  bbsDetail: (nttUid: number) => ['bbs', 'detail', nttUid] as const
};

const mutateKeys: Record<MutateKeyNames, any> = {
  registBbsPost: ['bbs', 'regist'] as const,
  modifyBbsPost: ['bbs', 'modify'] as const,
  removeBbs: ['bbs', 'remove'] as const
};

export const queryOptions = {
  bbsList: (params: BbsPostSearch) => ({
    queryKey: queryKeys.bbsList(params),
    queryFn: () => bbsService.getBbsList(params)
  }),
  bbsDetail: (nttUid: number) => ({
    queryKey: queryKeys.bbsDetail(nttUid),
    queryFn: () => bbsService.getBbsDetail(nttUid),
    enabled: !!nttUid && nttUid > 0
  })
};

export const mutateOptions = {
  registBbsPost: () => ({
    mutationKey: mutateKeys.registBbsPost,
    mutationFn: (params: BlobPayload<BbsPost>) => bbsService.registBbsPost(params)
  }),
  modifyBbsPost: () => ({
    mutationKey: mutateKeys.modifyBbsPost,
    mutationFn: (params: BlobPayload<BbsPost>) => bbsService.modifyBbsPost(params)
  }),
  removeBbs: () => ({
    mutationKey: mutateKeys.removeBbs,
    mutationFn: (payload: BbsPost) => bbsService.removeBbs(payload)
  })
};
