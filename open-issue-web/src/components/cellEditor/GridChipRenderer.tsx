import { Box, Chip, SxProps, Theme } from '@mui/material';
import { CustomCellRendererProps } from 'ag-grid-react';
import { ExColDef } from 'components/grid/grid.types';
import { ComponentType } from 'react';

export interface GridChipOptions {
  label: string;
  value: any;
  color?: string;
  bgColor?: string;
  Icon?: ComponentType<{ color?: string; height?: string | number }>;
}

const initSx: SxProps<Theme> = {
  width: 'fit-content',
  height: '24px',
  borderRadius: '5px',
  '& span': { fontSize: '0.8rem' }
};

const chipFilter = (matchValue: any, options: GridChipOptions[]) => {
  try {
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === matchValue) {
        const { value: _, label, Icon, ...props } = options[i];
        return (
          <Chip
            label={label}
            icon={Icon && <Icon color={props.color} height={'auto'} />}
            sx={{ ...initSx, color: props.color, bgcolor: props.bgColor, border: `1px solid ${props.color}` }}
          />
        );
      }
    }

    throw new Error('An erorr occurred while rendering chip component.');
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return <Chip label={'ERROR'} color={'error'} sx={initSx} />;
  }
};

export const GridChipRenderer = ({
  value,
  colDef,
  defaultChipSx
}: Omit<CustomCellRendererProps, 'colDef'> & { colDef: ExColDef; defaultChipSx?: SxProps }) => {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        {colDef?.context?.chipOption ? (
          chipFilter(value, colDef?.context?.chipOption)
        ) : (
          <Chip label={value} sx={{ ...initSx, ...defaultChipSx }} />
        )}
      </Box>
    </>
  );
};
