import { Box, Typography, useTheme, alpha } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { OpenIssueType } from '../index';
import { calculateDelay } from '../util';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';

/** Figma Design Tokens */
const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';
const FIGMA_SHADOW_CARD =
  '0px 16px 48px 0px rgba(17,24,39,0.04), 0px 12px 24px 0px rgba(17,24,39,0.04), 0px 6px 8px 0px rgba(17,24,39,0.02), 0px 2px 3px 0px rgba(17,24,39,0.02)';

/**
 * Figma 중요도 색상 (Section 5 기준)
 * 1=Gray, 2=Blue, 3=Orange, 4=Purple, 5=Red
 * Highlight Colors 토큰 사용
 */
const importanceStyles: Record<string, { bg: string; color: string; border: string }> = {
  '1': { bg: 'rgb(248, 248, 247)', color: 'rgba(83, 86, 90, 1)', border: 'rgba(213, 214, 215, 1)' },       // Gray
  '2': { bg: '#e0f2fe', color: '#2563eb', border: 'rgba(191, 219, 254, 1)' },                                // Blue (brand-200)
  '3': { bg: 'rgb(251, 236, 221)', color: '#c2410c', border: 'rgb(237, 203, 168)' },                         // Orange
  '4': { bg: '#f3e8ff', color: '#7c3aed', border: 'rgb(216, 191, 255)' },                                    // Purple
  '5': { bg: '#ffe4e6', color: '#dc2626', border: 'rgb(253, 186, 191)' }                                     // Red
};

/** 왼쪽 보더 색상 (중요도 + 지연) */
const borderLeftStyles: Record<string, string> = {
  '5': '#dc2626',   // error-main 계열
  '4': '#7c3aed',   // purple
  '3': '#ea580c'    // orange
};

interface KanbanCardProps {
  issue: OpenIssueType;
  onClick?: (issue: OpenIssueType) => void;
}

const KanbanCard = ({ issue, onClick }: KanbanCardProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const delay = calculateDelay(issue);
  const isDelayed = delay !== null && delay > 0;
  const isCompleted = issue.issueState === '78106';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: issue.oid });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1
  };

  const borderLeftColor = borderLeftStyles[issue.importance] || (isDelayed ? '#faad14' : 'transparent');
  const importanceStyle = importanceStyles[issue.importance];

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(issue)}
      sx={{
        p: 1.5,
        mb: 1,
        // Figma: radius-md = 8px
        borderRadius: '8px',
        backgroundColor: theme.palette.background.paper,
        // Figma: gray-200 border
        border: `1px solid rgba(234, 234, 235, 1)`,
        borderLeft: `3px solid ${borderLeftColor}`,
        cursor: 'pointer',
        transition: `all 0.2s ${FIGMA_EASING}`,
        position: 'relative',
        '&:hover': {
          boxShadow: FIGMA_SHADOW_CARD,
          // Figma: gray-200 hover border → slightly darker
          borderColor: 'rgba(213, 214, 215, 1)',
          transform: 'translateY(-1px)'
        },
        '&:last-child': {
          mb: 0
        },
        ...(isDelayed && !isCompleted && {
          backgroundColor: alpha('#E41B23', 0.02) // Figma error-main tint
        }),
        ...(isCompleted && {
          opacity: 0.6
        }),
        ...(isDragging && {
          boxShadow: FIGMA_SHADOW_CARD,
          zIndex: 10
        })
      }}
    >
      {/* Row 1: 이슈번호 + 중요도 배지 */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.75}>
        {/* Figma subtitle1: 12px(0.75rem), 600 */}
        <Typography
          variant="subtitle1"
          sx={{
            color: 'rgba(125, 127, 130, 1)', // gray-500
            letterSpacing: '0.02em'
          }}
        >
          {issue.issueNo}
        </Typography>
        {issue.importanceNm && importanceStyle && (
          <Box
            sx={{
              px: 0.75,
              py: 0.15,
              // Figma: radius-xs = 4px
              borderRadius: '4px',
              backgroundColor: importanceStyle.bg,
              border: `1px solid ${importanceStyle.border}`,
              display: 'inline-flex',
              alignItems: 'center'
            }}
          >
            {/* Figma overline: 10px(0.625rem), 600 */}
            <Typography
              variant="overline"
              sx={{
                color: importanceStyle.color,
                lineHeight: 1.4,
                textTransform: 'none'
              }}
            >
              {issue.importanceNm}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Row 2: 설명 */}
      {/* Figma body1: 13px(0.8125rem), 500 */}
      <Typography
        variant="body1"
        sx={{
          mb: 1,
          color: 'rgba(64, 65, 69, 1)', // gray-700
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          ...(isCompleted && {
            textDecoration: 'line-through',
            color: 'rgba(166, 167, 171, 1)' // gray-400
          })
        }}
      >
        {(issue.description || issue.contents || '').split('\n')[0]}
      </Typography>

      {/* Row 3: 담당자 + 날짜 + 지연 */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {/* Figma subtitle2: 11px(0.6875rem), 500 */}
        <Typography
          variant="subtitle2"
          sx={{ color: 'rgba(125, 127, 130, 1)' }} // gray-500
        >
          {issue.issueManagerNm || issue.assignedTo || '-'}
        </Typography>
        <Box display="flex" gap={0.75} alignItems="center">
          {issue.finDt && (
            <Typography
              variant="subtitle2"
              sx={{
                color: isDelayed
                  ? alpha('#E41B23', 0.75)     // Figma error-main
                  : 'rgba(166, 167, 171, 1)'   // gray-400
              }}
            >
              ~{dayjs(issue.finDt).format('MM/DD')}
            </Typography>
          )}
          {isDelayed && !isCompleted && (
            <Box
              sx={{
                px: 0.6,
                py: 0.1,
                borderRadius: '4px',
                // Figma Highlight Red
                backgroundColor: '#ffe4e6',
                border: '1px solid rgb(253, 186, 191)',
                display: 'inline-flex',
                alignItems: 'center'
              }}
            >
              {/* Figma body2: 10px(0.625rem), 500 → bold for emphasis */}
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 700,
                  color: '#dc2626',
                  lineHeight: 1.3
                }}
              >
                +{delay}{formatMessage({ id: 'dash-days' })}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default KanbanCard;
