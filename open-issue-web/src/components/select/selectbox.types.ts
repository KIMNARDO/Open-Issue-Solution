import { SelectChangeEvent } from '@mui/material';

export interface SelectboxType {
  label: string;
  value: string;
  useYn?: string;
}

export interface BasicSelectOptions {
  items: SelectboxType[];

  /**@description '전체' 옵션 포함 여부 */
  hasAllOption?: boolean;

  /**@description 기본값 설정 체크 시 사용할 기본값 */
  defaultValue?: string;

  /**@description searchBar select Change Event */
  onChange?: (e: SelectChangeEvent) => void;
}
