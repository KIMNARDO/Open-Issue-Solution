import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Stack, styled, Tooltip, tooltipClasses, TooltipProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

const CustomTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(
  ({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: 'rgba(0, 0, 0, 0.87)',
      boxShadow: theme.shadows[1],
      fontSize: 12
    }
  })
);

const SearchBarFrame = ({
  title,
  tooltip,
  useTitle = true,
  direction = 'end',
  children,
  description
}: {
  title: string;
  tooltip?: ReactNode;
  useTitle?: boolean;
  direction?: 'start' | 'center' | 'end';
  children?: ReactNode | ReactNode[];
  description?: string;
}) => {
  return (
    <Stack
      direction={'row'}
      spacing={1}
      width={'100%'}
      justifyContent={useTitle ? 'space-between' : direction}
      paddingLeft={useTitle ? 1 : 0}
      marginBottom={1}
      minHeight={36}
    >
      {useTitle && (
        <Box display={'flex'} alignItems={'center'} justifyContent={'start'} flexWrap={'wrap'}>
          <Typography variant="h5">{title}</Typography>
          {description && (
            <Typography variant="body1" color="text.secondary" sx={{ textIndent: 8 }}>
              {description}
            </Typography>
          )}
          {tooltip && (
            <CustomTooltip title={tooltip} sx={{ whiteSpace: 'pre-wrap' }}>
              <FontAwesomeIcon icon={faInfoCircle} size="sm" style={{ marginLeft: 5 }} />
            </CustomTooltip>
          )}
        </Box>
      )}
      <Box
        display={'flex'}
        alignItems={'center'}
        justifyContent={direction}
        flexWrap={'wrap'}
        gap={0.5}
        rowGap={1}
        width={useTitle ? 'unset' : '100%'}
        justifyItems={'stretch'}
      >
        {children}
      </Box>
    </Stack>
  );
};

export default SearchBarFrame;
