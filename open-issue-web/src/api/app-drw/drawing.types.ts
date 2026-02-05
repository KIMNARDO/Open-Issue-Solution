import { RevisionObject } from 'api/common/common.types';
import { CommonFile } from 'api/file/file.types';
import { WorkOrder } from 'api/project/project.types';
import { BlobPayload } from 'types/commonUtils.types';
import * as y from 'yup';

export const appDrwSchema = y.object({
  appDrawNo: y.string().required('도면번호를 입력해주세요').min(1, '도면번호를 입력해주세요').default(''),
  title: y.string().required('도면명을 입력해주세요').min(1, '도면명을 입력해주세요').default(''),
  appDrawUid: y.number().optional().default(-1),
  revision: y.string().optional().nullable().default('0'),
  status: y.string().optional().nullable().default(''),
  useAt: y.string().optional().nullable().default('Y')
});

/**
 * @description 승인도면
 */
export interface AppDrawing extends RevisionObject {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  appDrawUid: number;
  appDrawNo: string;
  projectUid?: number | null;
  projOrderUidList?: number[];
  orders?: WorkOrder[];
  title: string;
  revision: string | null;
  revisionDt?: string;
  expSubmittedDt?: string;
  submittedDt?: string;
  respondedDt?: string;
  managerUid?: number;
  deptManager?: string;
  customer?: string;
  status: string | null;
  statusNm?: string | null;
  remark?: string | null;
  useAt?: string | null;
  atchFileId?: number;
  attachFiles?: CommonFile[];
  attachedFilesBlob?: File[];
}

/**
 * @description 승인도면 검색
 */
export type AppDrawingSearch = Partial<AppDrawing> & {
  startDate?: string;
  endDate?: string;
};

/**
 * @description 승인도면 Blob payload
 */
export type AppDrawingBlobPayload = BlobPayload<AppDrawing>;

/**
 * @description 승인도면 일괄수정 payload
 */
export interface AppDrwBatchPayload extends Partial<Pick<AppDrawing, 'managerUid'>> {
  tdSubmittedDt?: string;
  projectUid: number;
  appDrawUidList: number[];
  deptManager?: string;
}

// ============================================================ sample ============================================================

export interface Drawing {
  id?: string;
  title: string;
  drawingNumber?: string;
  revision?: string;
  status?: 'DRAFT' | 'APPROVED' | 'OBSOLETE';
  description?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;
  fileUrl?: string;
  fileType?: string;
  fileSize?: number;
  tags?: string[];
  // Add any other drawing-specific fields as needed
}

export const drawingSchema = {
  id: '',
  title: '',
  drawingNumber: '',
  revision: 'A',
  status: 'DRAFT',
  description: '',
  createdBy: '',
  createdAt: new Date(),
  updatedBy: '',
  updatedAt: new Date(),
  fileUrl: '',
  fileType: '',
  fileSize: 0,
  tags: []
};

/**
 * @description 승인도면 변경문서 검색
 */
export interface DrawingChangeDocumentSearch {
  docNo?: string;
  docTitle?: string;
  projectNo?: string;
  projectName?: string;
  drawingNo?: string;
}

/**
 * @description 승인도면 설계변경문서
 */
export interface DrawingChangeDocument {
  docUid?: number;
  docNo: string;
  docTitle: string;
  changeType: string;
  priority: string;
  projectNo: string;
  projectName: string;
  drawingNo: string;
  revisionNo: string;
  requestDate: string;
  dueDate: string;
  requester: string;
  department: string;
  designer: string;
  reviewer: string;
  approver: string;
  description: string;
  status?: string;
  attachedFiles?: CommonFile[];
  attachedFilesBlob?: File[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export const drawingChangeDocumentInitialValues: DrawingChangeDocument = {
  docNo: '',
  docTitle: '',
  changeType: '',
  priority: '',
  projectNo: '',
  projectName: '',
  drawingNo: '',
  revisionNo: '',
  requestDate: '',
  dueDate: '',
  requester: '',
  department: '',
  designer: '',
  reviewer: '',
  approver: '',
  description: ''
};
