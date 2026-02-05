import { DocClassSearch } from './docClass.types';
import docClassService from './docClassService';

export const docClassQueryOptions = {
  selectList: (params: DocClassSearch) => ({
    queryKey: ['doc-class-list', params],
    queryFn: () => docClassService.selectDocClass(params)
  }),
  selectObject: (oid: number) => ({
    queryKey: ['doc-class-object', oid],
    queryFn: () => docClassService.selectDocClassObject(oid)
  }),
  selectTree: (rootOid: number) => ({
    queryKey: ['doc-class-tree', rootOid],
    queryFn: () => docClassService.selectDocClassTree(rootOid)
  })
};
