import { TableContainer, TableBody, TableRow, TableCell, SxProps, useTheme, Palette, Table, Paper } from '@mui/material';

const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const getLabelStyle = (variant: 'primary' | 'secondary', palette: Palette): SxProps => {
  switch (variant) {
    case 'secondary':
      return {
        bgcolor: palette.background.secondary,
        fontWeight: 700,
        fontSize: '10px',
        width: '12%',
        py: 0.75,
        px: 1.5,
        borderRight: `1px solid ${palette.divider}`,
        borderBottom: `1px solid ${palette.divider}`,
        color: palette.text.primary
      };
    default:
      return {
        background: 'linear-gradient(135deg, #e8ebf6 0%, #f5f5f5 100%)',
        fontWeight: 700,
        fontSize: '10px',
        width: '12%',
        py: 0.75,
        px: 1.5,
        borderRight: '1px solid #d0d0d0',
        color: '#121770'
      };
  }
};

const getValueStyle = (variant: 'primary' | 'secondary', palette: Palette): SxProps => {
  switch (variant) {
    case 'secondary':
      return {
        fontSize: '10px',
        width: '21%',
        py: 0.75,
        px: 1.5,
        borderRight: `1px solid ${palette.divider}`,
        borderBottom: `1px solid ${palette.divider}`
      };

    default:
      return {
        fontSize: '10px',
        width: '21%',
        py: 0.75,
        px: 1.5,
        borderRight: '1px solid #d0d0d0'
      };
  }
};

const ProfileTable = ({
  data,
  variant = 'primary',
  cntInRow = 2
}: {
  data: Object;
  variant?: 'primary' | 'secondary';
  cntInRow?: number;
}) => {
  const { palette } = useTheme();

  const chunks = chunkArray(
    Object.entries(data).map(([key, value]) => ({ label: key, value })),
    cntInRow
  );

  return (
    <TableContainer
      component={Paper}
      sx={{
        border: `2px solid ${palette.divider}`,
        borderRadius: 2,
        mb: 2
      }}
    >
      <Table size="small">
        <TableBody>
          {chunks.map((row, rowIndex) => (
            <TableRow
              sx={{
                '&:hover': { bgcolor: '#f5f7fc' },
                transition: 'all 0.2s ease'
              }}
              key={`profileTableRow-${rowIndex}`}
            >
              {row.map((item, cellIndex) => (
                <>
                  <TableCell sx={getLabelStyle(variant, palette)} key={`profileTableCell-label-${rowIndex}-${cellIndex}`}>
                    {String(item.label ?? '-')}
                  </TableCell>
                  <TableCell sx={getValueStyle(variant, palette)} key={`profileTableCell-value-${rowIndex}-${cellIndex}`}>
                    {String(item.value ?? '-')}
                  </TableCell>
                </>
              ))}
              {/* 빈 칸 채우기 (마지막 줄이 n개 미만인 경우) */}
              {row.length < cntInRow &&
                Array.from({ length: cntInRow - row.length }).map((_, idx) => <TableCell key={`empty-${idx}`}></TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProfileTable;
