import { Accordion, AccordionDetails, AccordionSummary, Box, Stack, Typography, useTheme } from '@mui/material';
import { Dispatch, ReactNode, SetStateAction } from 'react';

export interface CommonAccordionProps {
  expanded: boolean;
  setExpand: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  label: string;
}

/**
 *
 * @param expanded 열기/닫기 state
 * @param setExpand 열기/닫기 state setter
 * @param children 렌더링할 요소
 * @param label 표시할 텍스트
 * @returns
 */
const CommonAccordion = ({ expanded, setExpand, label, children }: CommonAccordionProps) => {
  const { palette } = useTheme();

  const handleChange = () => {
    setExpand((prev) => !prev);
  };

  return (
    <Box
      sx={{
        '& .MuiAccordion-root': {
          borderColor: palette.divider,
          '& .MuiAccordionDetails-root': {
            borderColor: palette.divider
          },
          '& .Mui-expanded': {
            // bgcolor: 'transparent',
            color: palette.primary.main
          }
        }
      }}
    >
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="h6">{label}</Typography>
          </Stack>
        </AccordionSummary>
        <AccordionDetails>
          <Box>{children}</Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default CommonAccordion;
