import { BDefineSearch } from './bdefine.types';
import bdefineservice from './bdefineservice';

export const bdefineQueryOptions = {
  list: (param: BDefineSearch) => ({
    queryKey: ['bdefine-list', param],
    queryFn: () => bdefineservice.getDefineList(param)
  }),
  detail: (oid: number) => ({
    queryKey: ['bdefine-detail', oid],
    queryFn: () => bdefineservice.getDefine(oid)
  })
};
