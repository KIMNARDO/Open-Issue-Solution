// distributionSchema
import { AppDrawing } from 'api/app-drw/drawing.types';
import { ChangeOrder } from 'api/changeOrder/changeOrder.types';
import { PartItem } from 'api/item/item.types';
import { Project } from 'api/project/project.types';
import { Qms } from 'api/qms/qms.types';
import { UserValidationType } from 'api/system/user/user.types';
import { RcTreeNode } from 'components/treeView/RcTreeView';
import * as yup from 'yup';

export const distributionSchema = yup.object({
  deploymentUid: yup.number().required().default(-1),
  type: yup.string().required('배포 구분은 필수 항목입니다').min(1, '배포 구분은 필수 항목입니다').default(''),
  typeNm: yup.string().nullable(),
  deploymentNo: yup.string().required('배포 NO는 필수 항목입니다').min(1, '배포 NO는 필수 항목입니다').default('AUTO'),
  deploymentNm: yup.string().required('배포명은 필수 항목입니다').min(1, '배포명은 필수 항목입니다').default(''),

  deployStrDt: yup.string().nullable(),
  deployEndDt: yup.string().nullable(),
  deployReturnDt: yup.string().nullable(),
  deployReceiveDt: yup.string().nullable(),
  deployUserUid: yup.number().nullable(),
  deployUserNm: yup.string().nullable(),
  deployDeptUid: yup.number().nullable(),
  deployDeptNm: yup.string().nullable(),

  deployDocUid: yup.number().required('배포 문서는 필수 항목입니다').min(1, '배포 문서는 필수 항목입니다').default(-1),
  // recepUserUid: yup.number().required('접수자는 필수 항목입니다').min(1, '접수자는 필수 항목입니다').default(-1),

  remark: yup.string().nullable(),
  status: yup.string().required().default('PROGRESS'),
  statusNm: yup.string().nullable().default('작성중'),

  receivers: yup.array().required('접수자는 필수 항목입니다').min(1, '접수자는 필수 항목입니다').default([])
});

/**
 * @description 배포
 */
export type Distribution = Omit<yup.InferType<typeof distributionSchema>, 'receivers'> & {
  viewers?: UserValidationType[];
  receivers?: DistributionReceiver[];
  docNo?: string;
  docTitle?: string;
  data?: Qms | Project | AppDrawing | PartItem | ChangeOrder;
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  docs?: string[];
};

export type DistributionHistory = Distribution & {
  revision?: string;
  revisionDt?: string;
  docUid?: number;
  docNo?: string;
  docTitle?: string;
};

/**
 * @description 배포 검색
 */
export type DistributionSearch = Partial<Distribution> & {
  startDate?: string;
  endDate?: string;
};

/**
 * @description 배포 트리
 */
export type DistributionSummary = RcTreeNode<Distribution>;

export interface DistributionReceiver {
  uid: number;
  deploymentUid: number;
  userUid: number;
  userNm?: string;
  orgCd?: number;
  orgNm?: string;
  receiveDt?: string;
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
}

export interface DistributionComment {
  deployCommentUid: number;
  deploymentUid: number;
  parentUid?: number;
  comment: string;
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
}
