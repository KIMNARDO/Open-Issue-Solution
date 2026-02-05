import { Box } from '@mui/material';
import { ValueFormatterParams } from 'ag-grid-community';
import { CustomCellRendererProps } from 'ag-grid-react';

type FormatRendererKey =
  | 'USD'
  | 'KRW'
  | 'NUMBER'
  | 'PERCENTAGE'
  | 'VND'
  | 'COMMA'
  | 'FRACTION'
  | 'KRWFR3'
  | 'INT'
  | 'PERCENTAGEFR2'
  | 'COMMAFR8';

const maxFractionDigit = 2;
const commonLocaleOption: Intl.NumberFormatOptions = { maximumFractionDigits: maxFractionDigit };

const NumberFormatRenderer: { [k in FormatRendererKey]: (props: CustomCellRendererProps) => JSX.Element } = {
  USD: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <span>{'$'}</span>
        <span>{parseFloat(props.value || 0).toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}</span>
      </Box>
    );
  },
  KRW: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <span>&#8361;</span>
        <span>{parseFloat(props.value || 0).toLocaleString('ko-KR', commonLocaleOption)}</span>
      </Box>
    );
  },
  KRWFR3: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <span>&#8361;</span>
        <span>{parseFloat(props.value || 0).toLocaleString('ko-KR', { maximumFractionDigits: 3 })}</span>
      </Box>
    );
  },
  INT: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'end'}>
        <span>{parseFloat(props.value || 0).toFixed(0)}</span>
      </Box>
    );
  },
  NUMBER: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'end'}>
        <span>{parseFloat(props.value || 0).toFixed(maxFractionDigit)}</span>
      </Box>
    );
  },
  PERCENTAGE: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'end'}>
        <span>
          {Math.round(parseFloat(props.value || 0))}
          {'%'}
        </span>
      </Box>
    );
  },
  PERCENTAGEFR2: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'end'}>
        <span>
          {parseFloat(props.value || 0).toFixed(2)}
          {'%'}
        </span>
      </Box>
    );
  },
  VND: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
        <span>{'₫'}</span>
        <span>{parseFloat(props.value || 0).toLocaleString('ko-KR', commonLocaleOption)}</span>
      </Box>
    );
  },
  COMMA: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'end'}>
        <span>{parseFloat(props.value || 0).toLocaleString('ko-KR', commonLocaleOption)}</span>
      </Box>
    );
  },
  COMMAFR8: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'end'}>
        <span>{parseFloat(props.value || 0).toLocaleString('ko-KR', { maximumFractionDigits: 8 })}</span>
      </Box>
    );
  },
  FRACTION: (props: CustomCellRendererProps) => {
    return (
      <Box display={'flex'} alignItems={'center'} justifyContent={'end'}>
        <span>{parseFloat(props.value || 0).toFixed(maxFractionDigit)}</span>
      </Box>
    );
  }
};

export const NumberValueFormatter: { [k in FormatRendererKey]?: (props: ValueFormatterParams) => string } = {
  INT: (props: ValueFormatterParams) => {
    return parseFloat(props.value || 0).toFixed(0);
  },
  NUMBER: (props: ValueFormatterParams) => {
    return parseFloat(props.value || 0).toFixed(maxFractionDigit);
  },
  PERCENTAGE: (props: ValueFormatterParams) => {
    return Math.round(parseFloat(props.value || 0))
      .toString()
      .concat('%');
  },
  PERCENTAGEFR2: (props: ValueFormatterParams) => {
    return parseFloat(props.value || 0)
      .toFixed(2)
      .concat('%');
  },
  COMMA: (props: ValueFormatterParams) => {
    return parseFloat(props.value || 0).toLocaleString('ko-KR', commonLocaleOption);
  },
  COMMAFR8: (props: ValueFormatterParams) => {
    return parseFloat(props.value || 0).toLocaleString('ko-KR', { maximumFractionDigits: 8 });
  },
  FRACTION: (props: ValueFormatterParams) => {
    return parseFloat(props.value || 0).toFixed(maxFractionDigit);
  }
};

export default NumberFormatRenderer;
