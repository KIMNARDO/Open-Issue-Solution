import { EbomSearch } from './ebom.types';
import EbomService from './ebomService';

type queryKeyNames = 'ebom' | 'ebomDetail';

export const queryKeys: Record<queryKeyNames, any> = {
  ebom: (params: EbomSearch) => ['ebom', params] as const,
  ebomDetail: (oid: number) => ['ebomDetail', oid] as const
};

export const queryOptions = {
  ebom: (params: EbomSearch) => ({
    queryKey: queryKeys.ebom(params),
    queryFn: () => EbomService.getEbomList(params)
  }),
  ebomDetail: (oid: number) => ({
    queryKey: queryKeys.ebomDetail(oid),
    queryFn: () => EbomService.getEbomDetail(oid)
  })
};
