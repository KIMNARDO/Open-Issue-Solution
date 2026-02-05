import ServiceBase from 'api/ServiceBase';
import { BbsPost, BbsPostSearch } from './bbs.types';
import { BlobPayload } from 'types/commonUtils.types';

class BbsService extends ServiceBase {
  registBbsPost(params: BlobPayload<BbsPost>) {
    return this.service.postBlob<BbsPost>(`bbs/registration`, params);
  }

  removeBbs(payload: BbsPost) {
    return this.service.post(`bbs/manage/remove/${payload.nttUid}`, payload);
  }

  modifyBbsPost(params: BlobPayload<BbsPost>) {
    return this.service.postBlob<BbsPost>(`bbs/manage/modify`, params);
  }

  getBbsList(params: BbsPostSearch) {
    return this.service.get<BbsPost[]>(`bbs`, { params });
  }

  getBbsDetail(nttUid: number) {
    return this.service.get<BbsPost>(`bbs/${nttUid}`);
  }
}

export default new BbsService();
