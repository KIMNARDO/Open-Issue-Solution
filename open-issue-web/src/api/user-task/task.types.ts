import { Project, ProjectDocument } from 'api/project/project.types';
import { Qms, QmsDocument } from 'api/qms/qms.types';
import * as yup from 'yup';

/**
 * @description 결재 객체
 */
export interface Approval {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  uid: number;
  approvalTargetUid: number;
  targetType: string;
  targetTable: string;
  approvalCount: number;
  comment: string;
  currentNum: number;
  status: string;
  statusNm?: string;
  parallel: string;
  title?: string;
}

export type ApprovalSearch = Partial<Approval> & {
  startDate?: string;
  endDate?: string;
};

export interface MyWorkSearch {
  title?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * @description 결재 단계 ( 결재선 정보 )
 */
export interface ApprovalStep {
  uid: number;
  approvalUid: number;
  approvalUserUid: number;
  ord: number;
  approvalType: string;
}

/**
 * @description 결재 태스크 ( 유저가 결재할 내용 )
 */
export interface ApprovalTask {
  uid: number;
  approvalUid: number;
  stepUid: number;
  userUid: number;
  userName?: string;
  approvalType: string;
  approvalTypeNm?: string;
  comment: string;
  approvalDt: string;
  actionType?: string;
  regDt?: number;
  regUid?: number;
  modDt?: number;
  modUid?: number;
  status: string;
  statusNm?: string;
}

/**
 * @description 결재선 payload
 */
export interface ApprovalPayload {
  approvalTargetUidList?: number[];
  approvalSteps: ApprovalStep[];
  targetType: string;
  targetTable?: string;
  approvalCount: number;
  comment: string;
  parallel: string;
  targetUid: number;
}

export interface ProjectApprovalPayload {
  docs?: ProjectDocument[];
  comment?: string;
}

/**
 * @description 결재 상세
 */
export interface ApprovalDetail {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  uid: number;
  approvalUid: number;
  stepUid: number;
  userUid: number;
  approvalType: string;
  comment: string;
  ord: number;
  approvalDt?: string;
  actionType?: string;
  status: string;
  statusNm?: string;
  approval: Approval;
  finalUserName?: string;
  documentData?: Qms | Project | null;
}

export interface ApprovalLine {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  uid: number;
  name: string;
  delUid?: number;
  delUserName?: string;
  delDt?: string;
}

export interface ApprovalLineUsers {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  uid: number;
  approvalUid: number;
  userUid: number;
  userName: string;
  type: string;
  ord: number;
}

export const approvalDetailSchema = yup.object().shape({
  uid: yup.number().required().default(-1),
  approvalUid: yup.number().required().default(-1),
  stepUid: yup.number().required().default(-1),
  userUid: yup.number().required().default(-1),
  approvalType: yup.string().required().default(''),
  comment: yup.string().required().default(''),
  ord: yup.number().required().default(-1),
  status: yup.string().required().default(''),
  approval: yup.object().shape({
    uid: yup.number().required().default(-1),
    approvalTargetUid: yup.number().required().default(-1),
    targetType: yup.string().required().default(''),
    targetTable: yup.string().required().default(''),
    approvalCount: yup.number().required().default(-1),
    comment: yup.string().required().default(''),
    currentNum: yup.number().required().default(-1),
    status: yup.string().required().default(''),
    parallel: yup.string().required().default('')
  })
});

export enum WorkType {
  ASSIGNED = 'ASSIGNED',
  DELAYED = 'DELAYED',
  COMPLETE = 'COMPLETE'
}

export type CurrentMyApproval = Record<'assigned' | 'reject' | 'approval' | 'weekly', number>;
export type CurrentMyWork = Record<'assigned' | 'delay' | 'approval' | 'weekly', number>;
export type CurrentQms = {
  count: Record<'assigned' | 'delay' | 'approval' | 'complete' | 'total', number>[];
  delayItems: QmsDocument[];
};
export type CurrentPartItem = Record<'assigned' | 'delay' | 'approval' | 'complete' | 'total', number>;
export type AsDashboardContent = Record<string, Record<'assigned' | 'wait' | 'approval' | 'total', number>[]>;
export type ProjectDashboardContent = Record<string, Record<'assigned' | 'delay' | 'complete', number>>;
