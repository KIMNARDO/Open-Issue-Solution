import { Typography, Chip, useTheme, Box } from '@mui/material';
import { CustomDetailCellRendererProps } from 'ag-grid-react';
import { TrendingUp, TrendingDown, Minus, Calendar, ExternalLink } from 'lucide-react';

const ProjectDetailRenderer = ({ data }: CustomDetailCellRendererProps) => {
  const { palette } = useTheme();

  return (
    <Box>
      {/* Two Column Layout */}
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
        {/* Left: Info Cards */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {/* Compact Info Grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 0.5,
              bgcolor: palette.background.primary,
              p: 0.75,
              borderRadius: '4px',
              border: '1px solid #e0e0e0'
            }}
          >
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Typography variant="caption">OEM:</Typography>
              <Typography variant="body2" sx={{ color: palette.text.primary }}>
                {data.oem}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Typography variant="caption">차종:</Typography>
              <Typography variant="body2" sx={{ color: palette.text.primary }}>
                {data.carModel}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Typography variant="caption">년식:</Typography>
              <Typography variant="body2" sx={{ color: palette.text.primary }}>
                {data.year}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Typography variant="caption">기술:</Typography>
              <Typography variant="body2" sx={{ color: palette.text.primary }}>
                {data.techName || '-'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Typography variant="caption">담당:</Typography>
              <Typography variant="body2" sx={{ color: palette.text.primary }}>
                {data.engineer}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
              <Typography variant="caption">출처:</Typography>
              <Typography variant="body2" sx={{ color: palette.text.primary }}>
                {data.dataSourceDate}
              </Typography>
            </Box>
          </Box>

          {/* Status & Pace Row */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box
              sx={{
                flex: 1,
                bgcolor: 'white',
                p: 0.5,
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Typography variant="caption" sx={{ color: '#999' }}>
                상태:
              </Typography>
              <Chip
                label={data.status || 'N/A'}
                size="small"
                sx={{
                  height: '14px',
                  fontSize: '8px',
                  fontWeight: 600,
                  bgcolor: palette.primary.lighter,
                  color: palette.primary.main,
                  border: `1px solid ${palette.primary.main}`,
                  '& .MuiChip-label': { px: 0.5, py: 0 }
                }}
              />
            </Box>

            <Box
              sx={{
                flex: 1,
                bgcolor: 'white',
                p: 0.5,
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Typography variant="caption" sx={{ color: '#999' }}>
                Pace:
              </Typography>
              {data.pace && data.pace > 0 ? (
                <>
                  <TrendingUp size={10} color="#4caf50" />
                  <Typography variant="body2" sx={{ color: '#4caf50' }}>
                    +{data.pace}%
                  </Typography>
                </>
              ) : data.pace && data.pace < 0 ? (
                <>
                  <TrendingDown size={10} color="#f44336" />
                  <Typography variant="body2" sx={{ color: '#f44336' }}>
                    {data.pace}%
                  </Typography>
                </>
              ) : (
                <>
                  <Minus size={10} color="#9e9e9e" />
                  <Typography variant="body2" sx={{ color: '#9e9e9e' }}>
                    0%
                  </Typography>
                </>
              )}
            </Box>

            <Box
              sx={{
                flex: 1,
                bgcolor: 'white',
                p: 0.5,
                borderRadius: '4px',
                border: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Typography variant="caption" sx={{ color: '#999' }}>
                진행:
              </Typography>
              <Typography variant="body2" sx={{ color: palette.success.main }}>
                {data.progress}%
              </Typography>
            </Box>
          </Box>

          {/* Tags */}
          {data.tags && data.tags.length > 0 && (
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {/* {data.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  sx={{
                    height: '14px',
                    fontSize: '7px',
                    fontWeight: 600,
                    '& .MuiChip-label': { px: 0.5, py: 0 },
                    bgcolor:
                      tag === 'INITIATIVE'
                        ? '#e3f2fd'
                        : tag === 'HIGH'
                          ? '#ffebee'
                          : tag === 'ACTIVE'
                            ? '#e8f5e9'
                            : tag === 'RESEARCH'
                              ? '#f3e5f5'
                              : tag === 'IDEA'
                                ? '#fff3e0'
                                : tag === 'BUG'
                                  ? '#ffebee'
                                  : tag === 'DESIGN'
                                    ? '#e1f5fe'
                                    : tag === 'PROTOTYPE'
                                      ? '#fce4ec'
                                      : tag === 'TEST'
                                        ? '#f1f8e9'
                                        : tag === 'PLANNED'
                                          ? '#f5f5f5'
                                          : '#eeeeee',
                    color:
                      tag === 'INITIATIVE'
                        ? '#1565c0'
                        : tag === 'HIGH'
                          ? '#c62828'
                          : tag === 'ACTIVE'
                            ? '#2e7d32'
                            : tag === 'RESEARCH'
                              ? '#6a1b9a'
                              : tag === 'IDEA'
                                ? '#ef6c00'
                                : tag === 'BUG'
                                  ? '#c62828'
                                  : tag === 'DESIGN'
                                    ? '#0277bd'
                                    : tag === 'PROTOTYPE'
                                      ? '#ad1457'
                                      : tag === 'TEST'
                                        ? '#558b2f'
                                        : tag === 'PLANNED'
                                          ? '#616161'
                                          : '#757575'
                  }}
                />
              ))} */}
            </Box>
          )}
        </Box>

        {/* Right: Schedule Timeline - Compact Width */}
        <Box
          sx={{
            width: 280,
            bgcolor: 'white',
            p: 0.75,
            borderRadius: '4px',
            border: '1px solid #e0e0e0',
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Calendar size={9} color="#999" />
              <Typography variant="caption" sx={{ color: '#999' }}>
                프로젝트 일정
              </Typography>
            </Box>
            <Box
              onClick={(e) => {
                e.stopPropagation();
                // onViewDetail?.(row.id, row.projectName);
              }}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.25,
                py: 0.625,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFC000 100%)',
                color: '#1a1a1a',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4), 0 0 0 0 rgba(255, 215, 0, 0.5)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                '@keyframes pulse': {
                  '0%, 100%': {
                    boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4), 0 0 0 0 rgba(255, 215, 0, 0.5)'
                  },
                  '50%': {
                    boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4), 0 0 0 4px rgba(255, 215, 0, 0)'
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                  transition: 'left 0.5s'
                },
                '&:hover': {
                  background: 'linear-gradient(135deg, #FFED4E 0%, #FFD700 100%)',
                  transform: 'translateY(-2px) scale(1.02)',
                  boxShadow: '0 6px 20px rgba(255, 215, 0, 0.6), 0 0 20px rgba(255, 215, 0, 0.3)',
                  animation: 'none',
                  '&::before': {
                    left: '100%'
                  },
                  '& svg': {
                    transform: 'translateX(3px) rotate(-5deg)'
                  }
                },
                '&:active': {
                  transform: 'translateY(0) scale(0.98)',
                  boxShadow: '0 2px 4px rgba(255, 215, 0, 0.4)'
                }
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  lineHeight: 1,
                  letterSpacing: '0.03em',
                  textShadow: '0 1px 2px rgba(255, 255, 255, 0.3)',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                상세보기
              </Typography>
              <ExternalLink
                size={11}
                style={{
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  strokeWidth: 2.5,
                  filter: 'drop-shadow(0 1px 1px rgba(255, 255, 255, 0.2))',
                  position: 'relative',
                  zIndex: 1
                }}
              />
            </Box>
          </Box>

          {/* Compact Timeline */}
          <Box sx={{ position: 'relative', height: 20, mt: 0.5 }}>
            {/* Timeline track */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: '#f0f0f0',
                borderRadius: '2px'
              }}
            />

            {/* Timeline bars - simplified */}
            <Box
              sx={{
                position: 'absolute',
                left: '15%',
                width: '25%',
                height: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: '#90caf9',
                borderRadius: '2px'
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                left: '40%',
                width: '35%',
                height: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: '#121770',
                borderRadius: '2px',
                boxShadow: '0 1px 3px rgba(18,23,112,0.3)'
              }}
            />
          </Box>

          {/* Timeline Labels */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.25 }}>
            <Typography variant="caption" sx={{ color: '#aaa' }}>
              2024 Q4
            </Typography>
            <Typography variant="caption" sx={{ color: '#666' }}>
              2025 전체
            </Typography>
            <Typography variant="caption" sx={{ color: '#aaa' }}>
              2026 Q1
            </Typography>
          </Box>

          {/* Date Range */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              pt: 0.5,
              mt: 0.5,
              borderTop: '1px solid #f0f0f0'
            }}
          >
            <Typography variant="body2" sx={{ color: '#666' }}>
              시작: 2024-10
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              종료: 2026-02
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectDetailRenderer;
