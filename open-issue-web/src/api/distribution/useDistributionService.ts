import { useMutation, useQuery } from '@tanstack/react-query';
import { mutateOptions, queryOptions } from './dist.queries';
import { DistributionSearch } from './dist.types';

export const useDistributionSummary = () => useQuery(queryOptions.distributionSummary({}));
export const useDistributionDetail = (deploymentUid: number) => useQuery(queryOptions.distributionDetail(deploymentUid));
export const useDistInboxSummary = (userUid: number) => useQuery(queryOptions.distInboxSummary({}, userUid));
export const useDistOutboxSummary = (userUid: number) => useQuery(queryOptions.distOutboxSummary({}, userUid));
export const useDistributionHistory = (param: DistributionSearch) => useQuery(queryOptions.distributionHistory(param));
export const useDistributionComment = (deploymentUid: number) => useQuery(queryOptions.distributionComment(deploymentUid));

export const useRegistDistribution = () => useMutation(mutateOptions.registDistribution());
export const useModifyDistribution = () => useMutation(mutateOptions.modifyDistribution());
export const useReturnDistribution = () => useMutation(mutateOptions.returnDistribution());
export const useExpireDistribution = () => useMutation(mutateOptions.expireDistribution());
export const useRegistTempDocument = () => useMutation(mutateOptions.registTempDocument());
export const useModifyTempDocument = () => useMutation(mutateOptions.modifyTempDocument());
export const useRemoveTempDocument = () => useMutation(mutateOptions.removeTempDocument());
export const useReceiveDistribution = () => useMutation(mutateOptions.receiveDistribution());
export const useRedeployDistribution = () => useMutation(mutateOptions.redeployDistribution());
export const useRegistDistributionComment = () => useMutation(mutateOptions.registDistributionComment());
export const useRemoveDistributionComment = () => useMutation(mutateOptions.removeDistributionComment());
