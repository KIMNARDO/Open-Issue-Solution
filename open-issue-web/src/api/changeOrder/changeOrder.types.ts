import { CommonFile } from 'api/file/file.types';
import { RowDataBase } from 'components/grid/grid.types';
import dayjs from 'dayjs';
import { BlobPayload } from 'types/commonUtils.types';
import * as yup from 'yup';

/**
 * @description 설계변경
 */
export interface ChangeOrder {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  coUid: number;
  coNo: string;
  projectUid: number;
  drawType: string;
  drawTypeSearch?: string;
  changeType: string;
  customer?: string;
  orgCd?: string;
  reason?: string;
  submittedDt?: string;
  managerUid?: number;
  remark?: string;
  status: string;
  statusNm?: string;
  ord?: number;
  useAt: string;
  atchFileId?: string;
  attachFiles?: CommonFile[];
  changeOrderDetails?: ChangeOrderDetail[];
  attachedFilesBlob?: File[];
}

export const changeOrderSchema = yup.object({
  coUid: yup.number().required().default(-1),
  coNo: yup.string().required('설계변경번호를 입력해주세요').min(1, '설계변경번호를 입력해주세요').default(''),
  drawType: yup.string().required('설계변경유형을 선택해주세요').min(1, '설계변경유형을 선택해주세요').default(''),
  changeType: yup.string().required('도면종류를 선택해주세요').min(1, '도면종류를 선택해주세요').default(''),
  projectUid: yup.number().required('프로젝트를 선택해주세요').min(1, '프로젝트를 선택해주세요').default(-1),
  status: yup.string().required().default('PROGRESS'),
  useAt: yup.string().required().default('Y'),
  regDt: yup.string().optional().default(dayjs().format('YYYY-MM-DD'))
});

/**
 * @description 설계변경 내역
 */
export interface ChangeOrderDetail extends RowDataBase {
  coDetailUid: number;
  coUid: number;
  drawUid: number;
  title: string;
  reason: string;
  remark?: string;
  atchFileId?: string;
  beforeAttachFiles?: CommonFile[];
  afterAttachFiles?: CommonFile[];
}

export type ChangeOrderBlobPayload = BlobPayload<ChangeOrder>;
