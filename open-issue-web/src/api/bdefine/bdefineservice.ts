import ServiceBase from 'api/ServiceBase';
import { BDefine, BDefineSearch } from './bdefine.types';

class BDefineService extends ServiceBase {
  private readonly domain: string = '/define';

  getDefineList(param: BDefineSearch) {
    return this.service.get<BDefine[]>(`${this.domain}/list`, { params: param });
  }

  getDefine(oid: number) {
    return this.service.get<BDefine>(`${this.domain}`, { params: { oid } });
  }
}

export default new BDefineService();
