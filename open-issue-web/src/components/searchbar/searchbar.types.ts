import { CommonButtonProps } from 'components/buttons/CommonButton';
import { SelectboxType, BasicSelectOptions } from '../select/selectbox.types';

export type SearchBarItemTypes = 'input' | 'select' | 'button' | 'checkbox' | 'date' | 'daterange' | 'combo';

interface CheckBoxProps {
  trueValue?: string;
  falseValue?: string;
}

/**@deprecated */
export const SearchBarItemEnum = {
  INPUT: 'input',
  SELECT: 'select',
  BUTTON: 'button',
  CHECKBOX: 'checkbox',
  DATE: 'date',
  DATERANGE: 'daterange',
  COMBO: 'combo'
} as const;

export interface SearchBarItem {
  id: string;
  label?: string;
  type: SearchBarItemTypes;
  width?: number;
  placeholder?: string;

  /**@description 타입이 select일 때 사용 */
  selectProps?: BasicSelectOptions;

  /**@description 타입이 select일 때 사용 */
  checkBoxProps?: CheckBoxProps;

  /**@description 타입이 button일 때 사용 */
  btnProps?: CommonButtonProps;

  /**@description 타입이 select일 때 사용 */
  comboOptions?: { options: SelectboxType[]; onChange?: (value: string) => void };

  dataRangeProps?: { startName: string; endName: string };

  hidden?: boolean;
}
