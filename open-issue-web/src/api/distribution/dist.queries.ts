import DistributionService from './DistributionService';
import { Distribution, DistributionComment, DistributionSearch } from './dist.types';

type queryKeyNames =
  | 'distributionSummary'
  | 'distributionDetail'
  | 'distInboxSummary'
  | 'distOutboxSummary'
  | 'distributionHistory'
  | 'distributionComment';
type mutateKeyNames =
  | 'registDistribution'
  | 'modifyDistribution'
  | 'returnDistribution'
  | 'expireDistribution'
  | 'registTempDocument'
  | 'modifyTempDocument'
  | 'removeTempDocument'
  | 'receiveDistribution'
  | 'redeployDistribution'
  | 'registDistributionComment'
  | 'removeDistributionComment';

export const queryKeys: Record<queryKeyNames, any> = {
  distributionSummary: () => ['distribution', 'summary', 'history'] as const,
  distInboxSummary: () => ['distribution', 'summary', 'inbox'] as const,
  distOutboxSummary: () => ['distribution', 'summary', 'outbox'] as const,
  distributionDetail: (deploymentUid: number) => ['distribution', 'detail', deploymentUid] as const,
  distributionHistory: (type: string, deploymentUid: number) => ['distribution', 'history', type, deploymentUid] as const,
  distributionComment: (deploymentUid: number) => ['distribution', 'comment', deploymentUid] as const
};

export const queryOptions = {
  distributionSummary: (param: DistributionSearch) => ({
    queryKey: queryKeys.distributionSummary(),
    queryFn: () => DistributionService.getDistributionSummary(param)
  }),
  distInboxSummary: (param: DistributionSearch, userUid: number) => ({
    queryKey: queryKeys.distInboxSummary(),
    queryFn: () => DistributionService.getDistInboxSummary(param, userUid),
    enabled: !!userUid && userUid > 0
  }),
  distOutboxSummary: (param: DistributionSearch, userUid: number) => ({
    queryKey: queryKeys.distOutboxSummary(),
    queryFn: () => DistributionService.getDistOutboxSummary(param, userUid),
    enabled: !!userUid && userUid > 0
  }),
  distributionDetail: (deploymentUid: number) => ({
    queryKey: queryKeys.distributionDetail(deploymentUid),
    queryFn: () => DistributionService.getDistributionDetail(deploymentUid),
    enabled: !!deploymentUid && deploymentUid > 0
  }),
  distributionHistory: (param: DistributionSearch) => ({
    queryKey: queryKeys.distributionHistory(param.type, param.deployDocUid),
    queryFn: () => DistributionService.getDistributionHistory(param),
    enabled: !!param.type && param.type.length > 0 && !!param.deployDocUid && param.deployDocUid > 0
  }),
  distributionComment: (deploymentUid: number) => ({
    queryKey: queryKeys.distributionComment(deploymentUid),
    queryFn: () => DistributionService.getDistributionComment(deploymentUid),
    enabled: !!deploymentUid && deploymentUid > 0
  })
};

export const mutateKeys: Record<mutateKeyNames, any> = {
  registDistribution: () => ['distribution', 'regist'] as const,
  modifyDistribution: () => ['distribution', 'modify'] as const,
  returnDistribution: () => ['distribution', 'return'] as const,
  expireDistribution: () => ['distribution', 'expire'] as const,
  registTempDocument: () => ['distribution', 'registTempDocument'] as const,
  modifyTempDocument: () => ['distribution', 'modifyTempDocument'] as const,
  removeTempDocument: () => ['distribution', 'removeTempDocument'] as const,
  receiveDistribution: () => ['distribution', 'receive'] as const,
  redeployDistribution: () => ['distribution', 'redeploy'] as const,
  registDistributionComment: () => ['distribution', 'registComment'] as const,
  removeDistributionComment: () => ['distribution', 'removeComment'] as const
};

export const mutateOptions = {
  registDistribution: () => ({
    mutationKey: mutateKeys.registDistribution(),
    mutationFn: (payload: Distribution) => DistributionService.registDistribution(payload)
  }),
  modifyDistribution: () => ({
    mutationKey: mutateKeys.modifyDistribution(),
    mutationFn: (payload: Distribution) => DistributionService.modifyDistribution(payload)
  }),
  returnDistribution: () => ({
    mutationKey: mutateKeys.returnDistribution(),
    mutationFn: (deploymentUid: number) => DistributionService.returnDistribution(deploymentUid)
  }),
  expireDistribution: () => ({
    mutationKey: mutateKeys.expireDistribution(),
    mutationFn: (deploymentUid: number) => DistributionService.expireDistribution(deploymentUid)
  }),
  registTempDocument: () => ({
    mutationKey: mutateKeys.registTempDocument(),
    mutationFn: (payload: Distribution) => DistributionService.registTempDocument(payload)
  }),
  modifyTempDocument: () => ({
    mutationKey: mutateKeys.modifyTempDocument(),
    mutationFn: (payload: Distribution) => DistributionService.modifyTempDocument(payload)
  }),
  removeTempDocument: () => ({
    mutationKey: mutateKeys.removeTempDocument(),
    mutationFn: (deploymentUid: number) => DistributionService.removeTempDocument(deploymentUid)
  }),
  receiveDistribution: () => ({
    mutationKey: mutateKeys.receiveDistribution(),
    mutationFn: (deploymentUid: number) => DistributionService.receiveDistribution(deploymentUid)
  }),
  redeployDistribution: () => ({
    mutationKey: mutateKeys.redeployDistribution(),
    mutationFn: (deploymentUid: number) => DistributionService.redeployDistribution(deploymentUid)
  }),
  registDistributionComment: () => ({
    mutationKey: mutateKeys.registDistributionComment(),
    mutationFn: (payload: DistributionComment) => DistributionService.registDistributionComment(payload)
  }),
  removeDistributionComment: () => ({
    mutationKey: mutateKeys.removeDistributionComment(),
    mutationFn: (deployCommentUid: number) => DistributionService.removeDistributionComment(deployCommentUid)
  })
};
