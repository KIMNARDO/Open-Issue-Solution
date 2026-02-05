import { CommonFile } from 'api/file/file.types';
import * as y from 'yup';

/**
 * @description 게시글 정보
 */
export interface BbsPost {
  regUid?: number;
  regUserName?: string;
  regDt?: string;
  modUid?: number;
  modUserName?: string;
  modDt?: string;
  rnum?: number;
  bbsId?: string;
  nttUid: number;
  nttCategory?: string;
  nttCategoryNm?: string;
  nttSubject: string;
  nttContent?: string;
  readCount?: number;
  topLockAt?: string;
  answerAt?: string;
  parentNttUid?: number;
  answerLvl?: number;
  nttPwd?: string;
  sortOrder?: number;
  writeDt?: string;
  writerId?: string;
  writer?: string;
  pubBeginDate?: string;
  pubEndDate?: string;
  atchFileId?: string;
  useAt: string;
  attachFiles?: CommonFile[];
}

export const bbsSchema = y.object({
  nttUid: y.number().required().default(-1),
  nttSubject: y.string().required('제목을 입력해주세요').min(1, '제목을 입력해주세요').default(''),
  useAt: y.string().default('Y')
});

export type BbsPostSearch = Partial<BbsPost>;
