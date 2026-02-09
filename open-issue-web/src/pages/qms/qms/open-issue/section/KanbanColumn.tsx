import { Box, Typography, alpha } from '@mui/material';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';
import { OpenIssueType } from '../index';

/** Figma Design Tokens */
const FIGMA_EASING = 'cubic-bezier(0.46, 0.03, 0.52, 0.96)';

interface KanbanColumnProps {
  id: string;
  title: string;
  issues: OpenIssueType[];
  color: string;
  onCardClick?: (issue: OpenIssueType) => void;
}

const KanbanColumn = ({ id, title, issues, color, onCardClick }: KanbanColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        flex: 1,
        minWidth: 300,
        maxWidth: 420,
        display: 'flex',
        flexDirection: 'column',
        // Figma: gray-50 page background
        backgroundColor: isOver ? alpha(color, 0.04) : 'rgba(250, 250, 250, 1)',
        // Figma: radius-lg = 12px
        borderRadius: '12px',
        // Figma: gray-200 borders
        border: `1px solid ${isOver ? alpha(color, 0.35) : 'rgba(234, 234, 235, 1)'}`,
        transition: `all 0.2s ${FIGMA_EASING}`,
        height: '100%',
        overflow: 'hidden',
        ...(isOver && {
          boxShadow: `0 0 0 2px ${alpha(color, 0.12)}`,
        })
      }}
    >
      {/* 칼럼 헤더 */}
      <Box
        sx={{
          px: 2,
          py: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid rgba(234, 234, 235, 1)`,
          background: `linear-gradient(135deg, ${alpha(color, 0.07)} 0%, ${alpha(color, 0.02)} 100%)`
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 10,
              height: 10,
              // Figma: radius-xxs = 2px
              borderRadius: '2px',
              backgroundColor: color,
              boxShadow: `0 1px 3px ${alpha(color, 0.4)}`
            }}
          />
          {/* Figma h4: 14px(0.875rem), 700 */}
          <Typography
            variant="h4"
            sx={{
              letterSpacing: '0.01em',
              color: 'rgba(44, 45, 48, 1)' // gray-800
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box
          sx={{
            minWidth: 24,
            height: 24,
            // Figma: radius-sm = 6px
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(color, 0.1),
            border: `1px solid ${alpha(color, 0.15)}`
          }}
        >
          {/* Figma subtitle1: 12px(0.75rem), 600 */}
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color,
              lineHeight: 1,
              px: 0.5
            }}
          >
            {issues.length}
          </Typography>
        </Box>
      </Box>

      {/* 카드 영역 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1.25,
          minHeight: 100,
          '&::-webkit-scrollbar': {
            width: 4
          },
          '&::-webkit-scrollbar-thumb': {
            // Figma: gray-300
            backgroundColor: 'rgba(213, 214, 215, 1)',
            borderRadius: 2
          }
        }}
      >
        <SortableContext items={issues.map((i) => i.oid)} strategy={verticalListSortingStrategy}>
          {issues.map((issue) => (
            <KanbanCard key={issue.oid} issue={issue} onClick={onCardClick} />
          ))}
        </SortableContext>
        {issues.length === 0 && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 80,
              border: `2px dashed ${alpha(color, 0.2)}`,
              // Figma: radius-md = 8px
              borderRadius: '8px',
              backgroundColor: alpha(color, 0.02),
              transition: `all 0.2s ${FIGMA_EASING}`
            }}
          >
            {/* Figma subtitle2: 11px(0.6875rem), 500 */}
            <Typography
              variant="subtitle2"
              sx={{ color: 'rgba(166, 167, 171, 1)' }} // gray-400
            >
              Drop here
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default KanbanColumn;
