import ServiceBase from 'api/ServiceBase';
import { AppDrawing, AppDrawingBlobPayload, AppDrwBatchPayload } from './drawing.types';
import { RcTreeNode } from 'components/treeView/RcTreeview';
import { CommonFile } from 'api/file/file.types';
import { WorkOrder } from 'api/project/project.types';
import { ChangeOrder } from 'api/changeOrder/changeOrder.types';

class AppDrawingService extends ServiceBase {
  getAppDrawingListByPjtUid(pjtUid: number) {
    return this.service.get<AppDrawing[]>(`approval-drawing/list/${pjtUid}`);
  }

  getAppDrawingListTree() {
    return this.service.get<RcTreeNode<AppDrawing>>(`approval-drawing/list/tree`);
  }

  getAppDrawingList(param: Partial<AppDrawing>) {
    return this.service.post<AppDrawing[]>(`approval-drawing/list`, param);
  }

  getAppDrawingDetail(appDrawUid: number) {
    return this.service.get<AppDrawing>(`approval-drawing/${appDrawUid}`);
  }

  // GET
  // 승인도면 작업의뢰서 조회
  getAppDrawingWorkOrder(appDrawUid: number) {
    return this.service.get<WorkOrder[]>(`approval-drawing/work-order/${appDrawUid}`);
  }

  // GET
  // 승인도면 작업의뢰서 등록 Helper
  getAppDrawingWorkOrderHelper(projectUid: number, appDrawUid?: number) {
    return this.service.get<WorkOrder[]>(`approval-drawing/work-order/helper`, { params: { appDrawUid, projectUid } });
  }

  // GET
  // 승인도면 리비전 히스토리 조회
  getAppDrawingRevisionHistory(appDrawUid: number) {
    return this.service.get<AppDrawing[]>(`approval-drawing/revision-history/${appDrawUid}`);
  }

  // GET
  // 승인도면 작업의뢰서 상세 조회
  getAppDrawingByOrderUid(orderUid: number) {
    return this.service.get<AppDrawing>(`approval-drawing/work-order/appDraw/${orderUid}`);
  }

  // GET
  // 승인도면 설계변경 목록 조회
  getAppDrawingChangeOrderList(appDrawUid: number) {
    return this.service.get<ChangeOrder[]>(`approval-drawing/change-order/list/${appDrawUid}`);
  }

  registAppDrawing(payload: AppDrawingBlobPayload) {
    return this.service.postBlob(`/approval-drawing/registration`, payload);
  }

  modifyAppDrawing(payload: AppDrawingBlobPayload) {
    return this.service.postBlob(`/approval-drawing/modify/${payload.data.appDrawUid}`, payload);
  }

  batchPjtAppDrwManager(payload: AppDrwBatchPayload) {
    return this.service.post(`/approval-drawing/modify/tdSubManager/${payload.projectUid}`, payload);
  }

  batchPjtAppDrwTdSubmittedDate(payload: AppDrwBatchPayload) {
    return this.service.post(`/approval-drawing/modify/tdSubManager/${payload.projectUid}`, payload);
  }

  removeAppDrwFile(appDrawUid: number, file: CommonFile) {
    return this.service.post(`/approval-drawing/attachedFile/remove/${appDrawUid}`, file);
  }

  reviseAppDrawing(appDrawUid: number) {
    return this.service.post(`/approval-drawing/rev/${appDrawUid}`);
  }
}

export default new AppDrawingService();
