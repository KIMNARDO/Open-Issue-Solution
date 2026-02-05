import dayjs from 'dayjs';
import * as yup from 'yup';

export const qmsSchema = yup.object({
  category: yup.string().default(''),
  rank: yup.string().default(''),
  qmsName: yup.string(),
  revisionNumber: yup.string(),
  status: yup.string().oneOf(['DRAFT', 'APPROVED', 'OBSOLETE']).default('DRAFT'),
  regUser: yup.string().default(''),
  documentNumber: yup.string().required('문서 번호는 필수 항목입니다').min(1, '문서 번호는 필수 항목입니다').default(''),
  remark: yup.string(),
  revisionDate: yup.string(),
  stopDate: yup.string(),
  regDate: yup.string().default(dayjs().format('YYYY-MM-DD'))
});

export type Qms = yup.InferType<typeof qmsSchema>;

export const qmsDocSchema = yup.object({
  id: yup.string().required('ID는 필수 항목입니다').default(''),
  parentId: yup.string().nullable(),
  title: yup.string().required('문서 제목은 필수 항목입니다').min(1, '문서 제목은 필수 항목입니다').default(''),
  documentType: yup.string().oneOf(['FOLDER', 'FILE']).required('문서 유형을 선택해주세요').default('FILE'),
  documentNumber: yup.string().when('documentType', {
    is: 'FILE',
    then: (schema) => schema.required('문서 번호는 필수 항목입니다').min(1, '문서 번호는 필수 항목입니다').default(''),
    otherwise: (schema) => schema.nullable()
  }),
  revision: yup.string().when('documentType', {
    is: 'FILE',
    then: (schema) => schema.required('개정 번호는 필수 항목입니다').min(1, '개정 번호는 필수 항목입니다').default(''),
    otherwise: (schema) => schema.nullable()
  }),
  effectiveDate: yup.string().when('documentType', {
    is: 'FILE',
    then: (schema) => schema.required('시행일은 필수 항목입니다').default(dayjs().format('YYYY-MM-DD')),
    otherwise: (schema) => schema.nullable()
  }),
  status: yup.string().default('PROGRESS'),
  description: yup.string(),
  fileUrl: yup.string()
});

export type QmsDoc = yup.InferType<typeof qmsDocSchema>;
