import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Box, Input, InputProps } from '@mui/material';
import CommonButton from 'components/buttons/CommonButton';
import { MouseEventHandler } from 'react';
import { NumericFormat } from 'react-number-format';

interface ButtonInputProps extends Omit<InputProps, 'onChange'> {
  onChange: (value: string | number) => void;
  width?: number;
  icon?: IconProp;
  value?: number | string;
  numType?: 'KRW' | 'PERCENT' | 'NUMBER' | 'USD';
}

/**
 *
 * @param icon 버튼 아이콘
 * @param required 필수 표시
 * @param error error
 * @param width input 너비
 * @param name key값
 * @param value value
 * @param onChange handleChange
 * @param onClick handleClick
 * @returns
 */
const FormInput = ({ width = 1, icon, numType = 'NUMBER', ...props }: ButtonInputProps) => {
  const handleButtonAction: MouseEventHandler = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (props.onClick) {
      props.onClick(e);
    }
  };
  return (
    <Box display={'flex'} flexDirection={'row'} alignItems={'center'} width={width}>
      <NumericFormat
        value={props.value}
        placeholder=""
        name={props.name}
        onValueChange={({ floatValue }) => props.onChange(floatValue || 0)}
        thousandSeparator
        valueIsNumericString
        suffix={numType === 'PERCENT' ? '%' : undefined}
        prefix={numType === 'KRW' ? '₩  ' : numType === 'USD' ? '$  ' : undefined}
        customInput={Input}
        sx={{ height: 24, mr: 1, '& >.MuiInput-input': { textAlign: 'right', color: 'inherit', fontWeight: 400 } }}
      />
      <CommonButton icononly="true" icon={<FontAwesomeIcon icon={icon ? icon : faPen} />} size="small" onClick={handleButtonAction} />
    </Box>
  );
};

export default FormInput;
