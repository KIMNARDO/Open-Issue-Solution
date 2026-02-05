import { CodeLibrarySearch } from './library.types';
import libraryService from './libraryService';

export const libraryQueryOptions = {
  selectAllLibrary: () => ({
    queryKey: ['library', 'selectAllLibrary'],
    queryFn: () => libraryService.selectAllLibrary()
  }),
  selectLibraryList: () => ({
    queryKey: ['library', 'selectLibraryList'],
    queryFn: () => libraryService.selectLibrary({})
  }),
  selectLibrary: (oid: string) => ({
    queryKey: ['library', 'selectLibrary', oid],
    queryFn: () => libraryService.selectLibrary({ oid })
  })
};

export const codeLibQueryOptions = {
  selectAllCodeLibrary: () => ({
    queryKey: ['library', 'selectAllCodeLibrary'],
    queryFn: () => libraryService.selectAllCodeLibrary({})
  }),
  selectChildListCodeLibrary: (code: string) => ({
    queryKey: ['library', 'selectChildListCodeLibrary', code],
    queryFn: () => libraryService.selectChildListCodeLibrary(code)
  }),
  selectChildCodeLibrary: (param: CodeLibrarySearch) => ({
    queryKey: ['library', 'selectChildCodeLibrary', param],
    queryFn: () => libraryService.selectChildCodeLibrary(param)
  }),
  selectCodeLibrary: (oid: number) => ({
    queryKey: ['library', 'selectCodeLibrary', oid],
    queryFn: () => libraryService.selectCodeLibrary({ oid })
  })
};

export const libAssessQueryOptions = {
  selectAssessmentList: () => ({
    queryKey: ['library', 'selectAssessmentList'],
    queryFn: () => libraryService.selectAssessmentList()
  })
};
