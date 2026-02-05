import ServiceBase from 'api/ServiceBase';
import { ChangeOrder, ChangeOrderBlobPayload } from './changeOrder.types';
import { CommonFile } from 'api/file/file.types';
import { AppDrawing } from 'api/app-drw/drawing.types';

class ChangeOrderService extends ServiceBase {
  //     POST
  //   설계변경 저장
  save = (payload: ChangeOrderBlobPayload) => {
    return this.service.postBlob<ChangeOrder>(`change-order/save`, payload, { headers: { 'Content-Type': 'multipart/form-data' } });
  };

  //     POST
  //   설계변경 첨부파일 삭제
  removeAttachedFile = (coUid: number, file: CommonFile) => {
    return this.service.post<ChangeOrder>(`change-order/attachedFile/remove/${coUid}`, file);
  };

  //     GET
  //   설계변경 상세 조회
  getChangeOrder = (coUid: number) => {
    return this.service.get<ChangeOrder>(`change-order/${coUid}`);
  };

  //     GET
  //   설계변경 목록 조회
  getChangeOrderList = (param: Partial<ChangeOrder>) => {
    return this.service.post<ChangeOrder[]>(`change-order/list`, param);
  };

  //     GET
  //   설계변경 변경내역 등록 Helper (승인도)
  getChangeOrderDrawHelper = (projectUid: number, coUid?: number) => {
    return this.service.get<AppDrawing[]>(`change-order/draw/helper`, { params: { coUid, projectUid } });
  };
}

export default new ChangeOrderService();
