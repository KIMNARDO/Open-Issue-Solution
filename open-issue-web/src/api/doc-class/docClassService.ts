import ServiceBase from 'api/ServiceBase';
import { DocClassification, DocClassSearch } from './docClass.types';

class DocClassService extends ServiceBase {
  private readonly domain: string = '/documentClassification';

  updateDocClass = (payload: DocClassification) => this.service.post(`${this.domain}/update`, payload);

  selectDocClass = (params: DocClassSearch) => this.service.post<DocClassification[]>(`${this.domain}/sel`, params);

  selectDocClassObject = (oid: number) => this.service.post<DocClassification>(`${this.domain}/object`, { oid });

  insertDocClass = (payload: Partial<DocClassification>) => this.service.post(`${this.domain}/insert`, payload);

  deleteDocClass = (payload: Partial<DocClassification>) => this.service.post(`${this.domain}/delete`, payload);

  selectAllDocClass = (params: DocClassSearch) => this.service.post<DocClassification[]>(`${this.domain}/all`, params);
  selectDocClassTree = (rootOid: number) => this.service.get<DocClassification[]>(`${this.domain}/tree/${rootOid}`);
}

export default new DocClassService();
