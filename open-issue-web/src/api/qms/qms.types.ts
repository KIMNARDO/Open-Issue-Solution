import { RevisionObject } from 'api/common/common.types';
import { CommonFile } from 'api/file/file.types';
import { RcTreeNode } from 'components/treeView/RcTreeview';
import dayjs from 'dayjs';
import { BlobPayload } from 'types/commonUtils.types';
import * as y from 'yup';

/**
 * @description QMS 문서
 */
export interface QmsDocument extends RevisionObject {
  qsDocUid: number;
  qsDocNo: string;
  qsDocTitle: string;
  qsUid: number;
  type?: string | null;
  parentDocUid?: number | null;
  orgCd?: string | null;
  managerUid?: number | null;
  revision?: string | null;
  revisionDt?: string | null;
  status?: string | null;
  statusNm?: string | null;
  expSubmittedDt?: string | null;
  submittedDt?: string | null;
  respondedDt?: string | null;
  remark?: string | null;
  atchFileId?: string | null;
  attachFiles?: CommonFile[] | null;
  qsDocumentList?: QmsDocument[] | null;
  attachedFilesBlob?: File[];
  regUid?: number;
  regDt?: string;
}

/**
 * @description QMS 문서 Blob payload ( 파일 등 )
 */
export type QmsDocumentBlobPayload = BlobPayload<QmsDocument>;

export const qmsDocSchema = y.object({
  qsDocUid: y.number().required().default(-1),
  qsUid: y.number().required().default(-1),
  qsDocNo: y.string().required('문서번호를 입력해주세요').min(1, '문서번호를 입력해주세요').default(''),
  qsDocTitle: y.string().required('문서제목을 입력해주세요').min(1, '문서제목을 입력해주세요').default(''),
  orgCd: y.string().optional().nullable().default(''),
  managerUid: y.number().optional().nullable().default(0),
  revision: y.string().optional().nullable().default('1'),
  revisionDt: y.string().optional().nullable(),
  status: y.string().optional().nullable().default('WAIT'),
  expSubmittedDt: y.string().optional().nullable(),
  submittedDt: y.string().optional().nullable(),
  respondedDt: y.string().optional().nullable(),
  remark: y.string().optional().nullable().default('')
});

export const qmsSchema = y.object({
  regUid: y.number().required().default(-1),
  regUserName: y.string().optional().nullable(),
  regDt: y.string().required().default(dayjs().format('YYYY-MM-DD')),
  modUid: y.number().optional().nullable(),
  modUserName: y.string().optional().nullable(),
  modDt: y.string().optional().nullable(),
  qsUid: y.number().required().default(-1),
  qsNo: y.string().required('문서번호를 입력해주세요').min(1, '문서번호를 입력해주세요').default(''),
  qsLibraryUid: y.number().required().default(-1),
  qsLibraryTitle: y.string().required('품질시스템명을 입력해주세요').min(1, '품질시스템명을 입력해주세요').default(''),
  qsStepTitle: y.string().required('차수를 입력해주세요').min(1, '차수를 입력해주세요').default(''),
  qsClassTitle: y.string().required('분류를 입력해주세요').min(1, '분류를 입력해주세요').default(''),
  revision: y.string().required().default('1'),
  revisionDt: y.string().optional().nullable(),
  status: y.string().required().default('WAIT'),
  statusNm: y.string().optional().nullable(),
  remark: y.string().optional().nullable(),
  pauseDt: y.string().optional().nullable(),
  qsDocumentList: y.array().optional().default([])
});

/**
 * @description 품질시스템
 */
export type Qms = y.InferType<typeof qmsSchema>;

/**
 * @description 품질시스템 라이브러리 ( 품질시스템명 )
 */
export interface QmsLibrary {
  regUid: number;
  regUserName?: string | null;
  regDt: string;
  modUid?: number | null;
  modUserName?: string | null;
  modDt?: string | null;
  qsLibraryUid: number;
  qsLibraryTitle: string;
  qsStepUid: number;
  qsList?: Qms[];
}

export const initQmsLibrary: QmsLibrary = {
  regUid: -1,
  regUserName: '',
  regDt: dayjs().format('YYYY-MM-DD'),
  modUid: null,
  modUserName: null,
  modDt: null,
  qsLibraryUid: -1,
  qsLibraryTitle: '새 폴더',
  qsStepUid: -1,
  qsList: []
};

/**
 * @description 품질시스템 단계 ( 차수 )
 */
export interface QmsStep {
  regUid: number;
  regUserName?: string | null;
  regDt: string;
  modUid?: number | null;
  modUserName?: string | null;
  modDt?: string | null;
  qsStepUid: number;
  qsStepTitle: string;
  qsClassUid: number;
  qsLibraryList?: QmsLibrary[];
}

export const initQmsStep: QmsStep = {
  regUid: -1,
  regUserName: '',
  regDt: dayjs().format('YYYY-MM-DD'),
  modUid: null,
  modUserName: null,
  modDt: null,
  qsStepUid: -1,
  qsStepTitle: '새 폴더',
  qsClassUid: -1,
  qsLibraryList: []
};

/**
 * @description 품질시스템 분류 ( 분류 )
 */
export interface QmsClass {
  regUid: number;
  regUserName?: string | null;
  regDt: string;
  modUid?: number | null;
  modUserName?: string | null;
  modDt?: string | null;
  qsClassUid: number;
  qsClassTitle: string;
  qsStepList?: QmsStep[];
}

export const initQmsClass: QmsClass = {
  regUid: -1,
  regUserName: '',
  regDt: dayjs().format('YYYY-MM-DD'),
  modUid: null,
  modUserName: null,
  modDt: null,
  qsClassUid: -1,
  qsClassTitle: '새 폴더',
  qsStepList: []
};

/**
 * @description 품질시스템 트리 객체
 */
export type QmsSummary = RcTreeNode<Qms | QmsLibrary | QmsStep | QmsClass | QmsDocument> & { label?: string };
