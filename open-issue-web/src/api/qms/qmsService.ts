import ServiceBase from 'api/ServiceBase';
import { Qms, QmsClass, QmsDocument, QmsDocumentBlobPayload, QmsLibrary, QmsStep, QmsSummary } from './qms.types';
import { CommonFile } from 'api/file/file.types';

class QmsService extends ServiceBase {
  getQmsSummary() {
    return this.service.get<QmsSummary>(`quality-system/summary`);
  }
  getQmsList() {
    return this.service.get<Qms[]>(`quality-system/list`);
  }
  getQmsDetail(qsUid: number) {
    return this.service.get<Qms>(`quality-system/${qsUid}`);
  }

  getQmsDocumentDetail(qsDocUid: number) {
    return this.service.get<QmsDocument>(`quality-system/document/${qsDocUid}`);
  }

  registerQmsClass(payload: QmsClass) {
    return this.service.post<QmsClass>(`quality-system/registration/class`, payload);
  }

  registerQmsStep(payload: QmsStep) {
    return this.service.post<QmsStep>(`quality-system/registration/step`, payload);
  }

  registerQmsLibrary(payload: QmsLibrary) {
    return this.service.post<QmsLibrary>(`quality-system/registration/library`, payload);
  }

  registerQms(payload: Qms) {
    return this.service.post<Qms>(`quality-system/registration`, payload);
  }

  registerQmsDocument(payload: QmsDocumentBlobPayload) {
    return this.service.postBlob<QmsDocument>(`quality-system/registration/document`, payload);
  }

  modifyQmsClass(payload: QmsClass) {
    return this.service.post<QmsClass>(`quality-system/modify/class/${payload.qsClassUid}`, payload);
  }

  modifyQmsStep(payload: QmsStep) {
    return this.service.post<QmsStep>(`quality-system/modify/step/${payload.qsStepUid}`, payload);
  }

  modifyQmsLibrary(payload: QmsLibrary) {
    return this.service.post<QmsLibrary>(`quality-system/modify/library/${payload.qsLibraryUid}`, payload);
  }

  modifyQms(payload: Qms) {
    return this.service.post<Qms>(`quality-system/modify/${payload.qsUid}`, payload);
  }

  modifyQmsDocument(payload: QmsDocumentBlobPayload) {
    return this.service.postBlob<QmsDocument>(`quality-system/modify/document/${payload.data.qsDocUid}`, payload);
  }

  modifyBatchQmsDocument(payload: QmsDocument[]) {
    return this.service.post<QmsDocument>(`quality-system/modify/document/batch`, payload);
  }

  removeQmsClass(qsClassUid: number) {
    return this.service.post<QmsClass>(`quality-system/remove/class/${qsClassUid}`);
  }

  removeQmsStep(qsStepUid: number) {
    return this.service.post<QmsStep>(`quality-system/remove/step/${qsStepUid}`);
  }

  removeQmsLibrary(qsLibraryUid: number) {
    return this.service.post<QmsLibrary>(`quality-system/remove/library/${qsLibraryUid}`);
  }

  removeQms(qsUid: number) {
    return this.service.post<Qms>(`quality-system/remove/${qsUid}`);
  }

  removeQmsDocument(qsDocUid: number) {
    return this.service.post<QmsDocument>(`quality-system/remove/document/${qsDocUid}`);
  }

  //   POST
  // 품질시스템 문서 첨부파일 삭제
  removeQmsDocumentFile(qsDocUid: number, file: CommonFile) {
    return this.service.post<QmsDocument>(`quality-system/document/attachedFile/remove/${qsDocUid}`, file);
  }

  pauseQmsDocument(qsDocUid: number) {
    return this.service.post<QmsDocument>(`quality-system/pause/document/${qsDocUid}`);
  }

  // 품질시스템 개정
  reviseQms(qsUid: number) {
    return this.service.post<Qms>(`quality-system/rev/${qsUid}`);
  }

  // 품질시스템 문서 개정
  reviseQmsDocument(qsDocUid: number) {
    return this.service.post<QmsDocument>(`quality-system/rev/doc/${qsDocUid}`);
  }

  // 품질 시스템 문서 사용
  resumeQmsDocument(qsDocUid: number) {
    return this.service.post<QmsDocument>(`quality-system/use/document/${qsDocUid}`);
  }
}
export default new QmsService();
