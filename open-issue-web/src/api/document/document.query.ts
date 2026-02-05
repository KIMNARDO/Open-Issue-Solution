import documentService from './documentService';
import { DocumentSearch } from './document.types';

export const documentQueryOptions = {
  selectList: (params: DocumentSearch) => ({
    queryKey: ['document-list', params],
    queryFn: () => documentService.selectDocumentList(params)
  }),
  selectObject: (oid: number) => ({
    queryKey: ['document-object', oid],
    queryFn: () => documentService.selectDocumentDetail(oid)
  })
};
