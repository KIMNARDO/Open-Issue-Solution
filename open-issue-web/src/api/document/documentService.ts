import ServiceBase from 'api/ServiceBase';
import { Document, DocumentSearch } from './document.types';

class DocumentService extends ServiceBase {
  private readonly domain: string = '/document';

  selectDocumentList = ({ currentPage, pageSize, ...params }: DocumentSearch) =>
    this.service.postRaw<Document[]>(`${this.domain}`, params, { params: { offset: currentPage, limit: pageSize } });

  updateDocument = (payload: Document) => this.service.post(`${this.domain}/update`, payload);

  removeDocument = (oid: number) => this.service.post(`${this.domain}/remove`, { oid });

  registrationDocument = (payload: Partial<Document>) => this.service.post(`${this.domain}/registration`, payload);

  selectDocumentDetail = (oid: number) => this.service.get<Document>(`${this.domain}/${oid}`);

  // reviseDocument = (params: any) => this.service.post(`${this.domain}/revise`, params);
}

export default new DocumentService();
