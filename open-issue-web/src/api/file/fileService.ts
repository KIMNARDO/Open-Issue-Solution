import { CommonFile } from 'api/file/file.types';
import ServiceBase from 'api/ServiceBase';
import axiosServices from 'utils/axios';

class FileService extends ServiceBase {
  private readonly domain: string = '/http-file';

  uploadFile(oid: number, files: File[]) {
    return this.service.postBlob(
      `${this.domain}/upload`,
      { files, data: {} },
      { params: { oid }, headers: { 'Content-Type': 'multipart/form-data' } }
    );
  }

  reviseFile() {
    return this.service.post(`${this.domain}/revise`);
  }

  uploadBomFile() {
    return this.service.post(`${this.domain}/bom/upload`);
  }

  deleteBomFile() {
    return this.service.post(`${this.domain}/bom/delete`);
  }

  deleteFile(fileOid: number) {
    return this.service.delete(`${this.domain}/${fileOid}`);
  }

  getFile(fileOid: number) {
    return this.service.get(`${this.domain}/${fileOid}`);
  }

  listFile(param: { oid: number }) {
    return this.service.get<CommonFile[]>(`${this.domain}/list`, { params: param });
  }

  downloadFile(fileOid: number) {
    return axiosServices.get<Blob>(`${this.domain}/download/${fileOid}`, { responseType: 'blob' });
  }
}

export default new FileService();
