import ServiceBase from 'api/ServiceBase';
import { Ebom, EbomSearch } from './ebom.types';

class EbomService extends ServiceBase {
  private readonly domain: string = '/ebom';

  // ebom
  getEbomList({ currentPage, pageSize, ...params }: EbomSearch) {
    return this.service.post<Ebom[]>(`${this.domain}/epart`, params, {
      params: { offset: currentPage, limit: pageSize }
    });
  }

  getEbomDetail(oid: number) {
    return this.service.get<Ebom>(`${this.domain}/epart/${oid}`);
  }
}

export default new EbomService();
