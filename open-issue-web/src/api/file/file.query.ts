import fileService from './fileService';

export const fileQueryOptions = {
  selectFile: (fileOid: number) => ({
    queryKey: ['file', 'selectFile'],
    queryFn: () => fileService.getFile(fileOid)
  }),
  selectFileList: (param: { oid: number }) => ({
    queryKey: ['file', 'selectFileList', param],
    queryFn: () => fileService.listFile(param)
  })
};
