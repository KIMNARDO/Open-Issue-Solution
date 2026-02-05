import { CommonFile } from 'api/file/file.types';
import { Qms, QmsClass, QmsDocument, QmsDocumentBlobPayload, QmsLibrary, QmsStep } from './qms.types';
import qmsService from './qmsService';

type queryKeyNames = 'qmsSummary' | 'qmsDetail' | 'qmsList' | 'qmsDocumentDetail';
type mutateKeyNames =
  | 'registerQmsClass'
  | 'registerQmsStep'
  | 'registerQmsLibrary'
  | 'modifyQmsClass'
  | 'modifyQmsStep'
  | 'modifyQmsLibrary'
  | 'removeQmsClass'
  | 'removeQmsStep'
  | 'removeQmsLibrary'
  | 'registerQms'
  | 'modifyQms'
  | 'removeQms'
  | 'registerQmsDocument'
  | 'modifyQmsDocument'
  | 'removeQmsDocument'
  | 'modifyBatchQmsDocument'
  | 'pauseQmsDocument'
  | 'removeQmsDocumentFile'
  | 'reviseQms'
  | 'reviseQmsDocument'
  | 'resumeQmsDocument';

export const queryKeys: Record<queryKeyNames, any> = {
  qmsSummary: () => ['qms', 'summary'] as const,
  qmsDetail: (qsUid: number) => ['qms', 'detail', qsUid] as const,
  qmsList: () => ['qms', 'list'] as const,
  qmsDocumentDetail: (qsDocUid: number) => ['qms', 'document', qsDocUid] as const
};

const mutateKeys: Record<mutateKeyNames, any> = {
  registerQmsClass: ['qms', 'register', 'class'] as const,
  registerQmsStep: ['qms', 'register', 'step'] as const,
  registerQmsLibrary: ['qms', 'register', 'library'] as const,
  modifyQmsClass: ['qms', 'modify', 'class'] as const,
  modifyQmsStep: ['qms', 'modify', 'step'] as const,
  modifyQmsLibrary: ['qms', 'modify', 'library'] as const,
  modifyBatchQmsDocument: ['qms', 'modify', 'batch', 'document'] as const,
  removeQmsClass: ['qms', 'remove', 'class'] as const,
  removeQmsStep: ['qms', 'remove', 'step'] as const,
  removeQmsLibrary: ['qms', 'remove', 'library'] as const,
  registerQms: ['qms', 'register'] as const,
  modifyQms: ['qms', 'modify'] as const,
  removeQms: ['qms', 'remove'] as const,
  registerQmsDocument: ['qms', 'register', 'document'] as const,
  modifyQmsDocument: ['qms', 'modify', 'document'] as const,
  removeQmsDocument: ['qms', 'remove', 'document'] as const,
  pauseQmsDocument: ['qms', 'pause', 'document'] as const,
  removeQmsDocumentFile: ['qms', 'remove', 'document', 'file'] as const,
  reviseQms: ['qms', 'revise'] as const,
  reviseQmsDocument: ['qms', 'document', 'revise'] as const,
  resumeQmsDocument: ['qms', 'resume', 'document'] as const
};

export const queryOptions = {
  qmsSummary: () => ({
    queryKey: queryKeys.qmsSummary(),
    queryFn: () => qmsService.getQmsSummary()
  }),
  qmsDetail: (qsUid: number) => ({
    queryKey: queryKeys.qmsDetail(qsUid),
    queryFn: () => qmsService.getQmsDetail(qsUid),
    enabled: !!qsUid && qsUid > 0
  }),
  qmsList: () => ({
    queryKey: queryKeys.qmsList(),
    queryFn: () => qmsService.getQmsList()
  }),
  qmsDocumentDetail: (qsDocUid: number) => ({
    queryKey: queryKeys.qmsDocumentDetail(qsDocUid),
    queryFn: () => qmsService.getQmsDocumentDetail(qsDocUid),
    enabled: !!qsDocUid && qsDocUid > 0
  })
};

export const mutateOptions = {
  registerQmsClass: () => ({
    mutationKey: mutateKeys.registerQmsClass,
    mutationFn: (payload: QmsClass) => qmsService.registerQmsClass(payload)
  }),
  registerQmsStep: () => ({
    mutationKey: mutateKeys.registerQmsStep,
    mutationFn: (payload: QmsStep) => qmsService.registerQmsStep(payload)
  }),
  registerQmsLibrary: () => ({
    mutationKey: mutateKeys.registerQmsLibrary,
    mutationFn: (payload: QmsLibrary) => qmsService.registerQmsLibrary(payload)
  }),
  modifyQmsClass: () => ({
    mutationKey: mutateKeys.modifyQmsClass,
    mutationFn: (payload: QmsClass) => qmsService.modifyQmsClass(payload)
  }),
  modifyQmsStep: () => ({
    mutationKey: mutateKeys.modifyQmsStep,
    mutationFn: (payload: QmsStep) => qmsService.modifyQmsStep(payload)
  }),
  modifyQmsLibrary: () => ({
    mutationKey: mutateKeys.modifyQmsLibrary,
    mutationFn: (payload: QmsLibrary) => qmsService.modifyQmsLibrary(payload)
  }),
  removeQmsClass: () => ({
    mutationKey: mutateKeys.removeQmsClass,
    mutationFn: (qsClassUid: number) => qmsService.removeQmsClass(qsClassUid)
  }),
  removeQmsStep: () => ({
    mutationKey: mutateKeys.removeQmsStep,
    mutationFn: (qsStepUid: number) => qmsService.removeQmsStep(qsStepUid)
  }),
  removeQmsLibrary: () => ({
    mutationKey: mutateKeys.removeQmsLibrary,
    mutationFn: (qsLibraryUid: number) => qmsService.removeQmsLibrary(qsLibraryUid)
  }),
  registerQms: () => ({
    mutationKey: mutateKeys.registerQms,
    mutationFn: (payload: Qms) => qmsService.registerQms(payload)
  }),
  modifyQms: () => ({
    mutationKey: mutateKeys.modifyQms,
    mutationFn: (payload: Qms) => qmsService.modifyQms(payload)
  }),
  removeQms: () => ({
    mutationKey: mutateKeys.removeQms,
    mutationFn: (qsUid: number) => qmsService.removeQms(qsUid)
  }),
  registerQmsDocument: () => ({
    mutationKey: mutateKeys.registerQmsDocument,
    mutationFn: (payload: QmsDocumentBlobPayload) => qmsService.registerQmsDocument(payload)
  }),
  modifyQmsDocument: () => ({
    mutationKey: mutateKeys.modifyQmsDocument,
    mutationFn: (payload: QmsDocumentBlobPayload) => qmsService.modifyQmsDocument(payload)
  }),
  removeQmsDocument: () => ({
    mutationKey: mutateKeys.removeQmsDocument,
    mutationFn: (qsDocUid: number) => qmsService.removeQmsDocument(qsDocUid)
  }),
  pauseQmsDocument: () => ({
    mutationKey: mutateKeys.pauseQmsDocument,
    mutationFn: (qsDocUid: number) => qmsService.pauseQmsDocument(qsDocUid)
  }),
  modifyBatchQmsDocument: () => ({
    mutationKey: mutateKeys.modifyBatchQmsDocument,
    mutationFn: (payload: QmsDocument[]) => qmsService.modifyBatchQmsDocument(payload)
  }),
  removeQmsDocumentFile: () => ({
    mutationKey: mutateKeys.removeQmsDocumentFile,
    mutationFn: ({ qsDocUid, file }: { qsDocUid: number; file: CommonFile }) => qmsService.removeQmsDocumentFile(qsDocUid, file)
  }),
  reviseQms: () => ({
    mutationKey: mutateKeys.reviseQms,
    mutationFn: (qsUid: number) => qmsService.reviseQms(qsUid)
  }),
  reviseQmsDocument: () => ({
    mutationKey: mutateKeys.reviseQmsDocument,
    mutationFn: (qsDocUid: number) => qmsService.reviseQmsDocument(qsDocUid)
  }),
  resumeQmsDocument: () => ({
    mutationKey: mutateKeys.resumeQmsDocument,
    mutationFn: (qsDocUid: number) => qmsService.resumeQmsDocument(qsDocUid)
  })
};
