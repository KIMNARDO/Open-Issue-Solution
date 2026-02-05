import { useQuery } from '@tanstack/react-query';
import { queryOptions } from './ebom.query';
import { EbomSearch } from './ebom.types';

export const useEbomList = (params: EbomSearch) => useQuery(queryOptions.ebom(params));
export const useEbomDetail = (oid: number) => useQuery(queryOptions.ebomDetail(oid));
