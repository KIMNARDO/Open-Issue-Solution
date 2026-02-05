import { useMutation, useQuery } from '@tanstack/react-query';
import { mutateOptions, queryOptions } from './qms.query';

export const useQmsSummary = () => useQuery(queryOptions.qmsSummary());
export const useQmsDetail = (qsUid: number) => useQuery(queryOptions.qmsDetail(qsUid));
export const useQmsList = () => useQuery(queryOptions.qmsList());
export const useQmsDocumentDetail = (qsDocUid: number) => useQuery(queryOptions.qmsDocumentDetail(qsDocUid));

export const useRegisterQmsClass = () => useMutation(mutateOptions.registerQmsClass());
export const useModifyQmsClass = () => useMutation(mutateOptions.modifyQmsClass());
export const useRemoveQmsClass = () => useMutation(mutateOptions.removeQmsClass());

export const useRegisterQmsStep = () => useMutation(mutateOptions.registerQmsStep());
export const useModifyQmsStep = () => useMutation(mutateOptions.modifyQmsStep());
export const useRemoveQmsStep = () => useMutation(mutateOptions.removeQmsStep());

export const useRegisterQmsLibrary = () => useMutation(mutateOptions.registerQmsLibrary());
export const useModifyQmsLibrary = () => useMutation(mutateOptions.modifyQmsLibrary());
export const useRemoveQmsLibrary = () => useMutation(mutateOptions.removeQmsLibrary());

export const useRegisterQms = () => useMutation(mutateOptions.registerQms());
export const useModifyQms = () => useMutation(mutateOptions.modifyQms());
export const useRemoveQms = () => useMutation(mutateOptions.removeQms());
export const useReviseQms = () => useMutation(mutateOptions.reviseQms());

export const useRegisterQmsDocument = () => useMutation(mutateOptions.registerQmsDocument());
export const useModifyQmsDocument = () => useMutation(mutateOptions.modifyQmsDocument());
export const useRemoveQmsDocument = () => useMutation(mutateOptions.removeQmsDocument());
export const usePauseQmsDocument = () => useMutation(mutateOptions.pauseQmsDocument());
export const useModifyBatchQmsDocument = () => useMutation(mutateOptions.modifyBatchQmsDocument());
export const useRemoveQmsDocumentFile = () => useMutation(mutateOptions.removeQmsDocumentFile());
export const useReviseQmsDocument = () => useMutation(mutateOptions.reviseQmsDocument());
export const useResumeQmsDocument = () => useMutation(mutateOptions.resumeQmsDocument());
