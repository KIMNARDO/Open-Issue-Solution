import { ColDef, ColGroupDef } from 'ag-grid-community';
import { AgGridReactProps } from 'ag-grid-react';

/**
 * 검색 조건 필드 타입
 */
export type SearchConditionFieldType = 'text' | 'select' | 'boolean';

/**
 * 셀렉트 옵션 타입
 */
export interface SelectOption {
  label: string;
  value: string | number;
}

/**
 * 검색 조건 필드 정의
 */
export interface SearchConditionField {
  /** 필드명 (Formik values key) */
  name: string;
  /** 필드 라벨 */
  label: string;
  /** 필드 타입 */
  type: SearchConditionFieldType;
  /** 플레이스홀더 (text 타입에 사용) */
  placeholder?: string;
  /** 셀렉트 옵션 (select 타입에 사용) */
  options?: SelectOption[];
  /** 기본값 */
  defaultValue?: any;
}

/**
 * SearchDialog Props
 */
export interface SearchDialogProps<T = any> {
  /** 다이얼로그 타이틀 */
  title: string;
  /** 검색 조건 필드 배열 */
  searchConditions: SearchConditionField[];
  /** 그리드 컬럼 정의 */
  columnDefs: (ColDef<T> | ColGroupDef<T>)[];
  /** 검색 API 호출 함수 */
  onSearch: (searchParams: Record<string, any>) => Promise<T[]>;
  /** 선택 시 콜백 */
  onSelect: (selectedRows: T) => void;
  /** 닫기 시 콜백 */
  onClose: () => void;
  /** 다이얼로그 오픈 여부 */
  open: boolean;
  /** 그리드 추가 props */
  gridProps?: Partial<AgGridReactProps<T>>;
  /** 다이얼로그 설명 */
  description?: string;
}
