import { useTheme } from '@mui/material/styles';
import { Box, Paper, Stack, Typography, alpha } from '@mui/material';
import { WarningOutlined } from '@ant-design/icons';
import { NullableId } from '../store/stackbar-store.types';

export const ErrorActiveElement = ({
  error,
  menuId,
  display
}: {
  error: Error | unknown;
  menuId: NullableId;
  display?: React.CSSProperties['display'];
}) => {
  const theme = useTheme();

  const errorMessage = error instanceof Error ? error.message : String(error);

  const resource = menuId
    ? {
        colorLighter: theme.palette.error.lighter,
        colorMain: theme.palette.error.main,
        color: 'error.main',
        message: '개발중인 화면입니다.'
      }
    : {
        colorLighter: theme.palette.info.lighter,
        colorMain: theme.palette.info.main,
        color: 'info.main',
        message: '선택된 메뉴가 없습니다.'
      };

  return (
    <Box sx={{ p: 1, /*mb: 15,*/ width: '100%', display }}>
      <Paper
        elevation={0}
        sx={{
          bgcolor: resource.colorLighter,
          border: `1px solid ${alpha(resource.colorMain, 0.5)}`,
          borderRadius: 1,
          p: 2,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <WarningOutlined style={{ fontSize: '1.15rem', color: resource.colorMain }} />
            <Typography variant="h4" fontWeight={600} color={resource.color}>
              {resource.message}
            </Typography>
          </Stack>

          {import.meta.env.DEV && (
            <Box
              sx={{
                bgcolor: alpha(resource.colorMain, 0.1),
                p: 1.5,
                borderRadius: 1,
                border: `1px dashed ${alpha(resource.colorMain, 0.3)}`
              }}
            >
              <Stack spacing={1}>
                <Typography variant="body2" color={resource.color} sx={{ fontWeight: 500 }}>
                  Error Details:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {errorMessage}
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};
