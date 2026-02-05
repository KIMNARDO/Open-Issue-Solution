import approvalService from './approvalService';

export const approvalQueryOptions = {
  approvalHistory: (targetOID: number) => ({
    queryKey: ['approval-history', targetOID],
    queryFn: () => approvalService.historyApproval(targetOID)
  })
};
