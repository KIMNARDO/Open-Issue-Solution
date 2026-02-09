import { useMemo, useState } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { DndContext, DragEndEvent, DragOverEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core';
import KanbanColumn from './KanbanColumn';
import { OpenIssueType } from '../index';
import { useUpdateOpenIssue } from 'api/qms/open-issue/useOpenIssueService';
import { commonNotification } from 'api/common/notification';
import { handleServerError } from 'utils/error';
import { useIntl } from 'react-intl';

/**
 * Figma Design Token 기반 칸반 칼럼 색상
 * - 진행(OPEN): brand-500 Blue
 * - 대기(PENDING): warning-main Gold
 * - 완료(CLOSED): success-main Green
 */
const KANBAN_COLUMNS = [
  { id: '78102', titleKey: 'kanban-open', color: '#3B82F6' },
  { id: '78104', titleKey: 'kanban-pending', color: '#faad14' },
  { id: '78106', titleKey: 'kanban-closed', color: '#52c41a' }
] as const;

interface KanbanBoardProps {
  issues: OpenIssueType[];
  onCardClick?: (issue: OpenIssueType) => void;
  refetch?: () => void;
}

const KanbanBoard = ({ issues, onCardClick, refetch }: KanbanBoardProps) => {
  const theme = useTheme();
  const { formatMessage } = useIntl();
  const { mutate: updateOpenIssue } = useUpdateOpenIssue();
  const [localIssues, setLocalIssues] = useState<OpenIssueType[]>([]);

  useMemo(() => {
    setLocalIssues(issues);
  }, [issues]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }
    })
  );

  const columnIssues = useMemo(() => {
    const grouped: Record<string, OpenIssueType[]> = {
      '78102': [],
      '78104': [],
      '78106': []
    };

    localIssues.forEach((issue) => {
      const state = issue.issueState || '78102';
      if (grouped[state]) {
        grouped[state].push(issue);
      } else {
        grouped['78102'].push(issue);
      }
    });

    return grouped;
  }, [localIssues]);

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIssue = localIssues.find((i) => i.oid === active.id);
    if (!activeIssue) return;

    const targetColumn = KANBAN_COLUMNS.find((c) => c.id === over.id);
    if (targetColumn && activeIssue.issueState !== targetColumn.id) {
      setLocalIssues((prev) =>
        prev.map((i) => (i.oid === active.id ? { ...i, issueState: targetColumn.id } : i))
      );
      return;
    }

    const overIssue = localIssues.find((i) => i.oid === over.id);
    if (overIssue && activeIssue.issueState !== overIssue.issueState) {
      setLocalIssues((prev) =>
        prev.map((i) => (i.oid === active.id ? { ...i, issueState: overIssue.issueState } : i))
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIssue = localIssues.find((i) => i.oid === active.id);
    if (!activeIssue) return;

    const originalIssue = issues.find((i) => i.oid === active.id);
    if (!originalIssue) return;

    if (activeIssue.issueState !== originalIssue.issueState) {
      updateOpenIssue(
        [{ ...activeIssue }],
        {
          onSuccess: () => {
            commonNotification.success(formatMessage({ id: 'msg-saved' }));
            refetch?.();
          },
          onError: (error) => {
            handleServerError(error);
            setLocalIssues(issues);
          }
        }
      );
    }
  };

  if (issues.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="50vh"
        sx={{
          borderRadius: '12px',
          border: `2px dashed ${theme.palette.divider}`,
          mx: 1,
          mt: 1
        }}
      >
        <Typography
          variant="body1"
          sx={{ color: 'text.disabled' }}
        >
          {formatMessage({ id: 'msg-no-data' })}
        </Typography>
      </Box>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <Box
        display="flex"
        gap={2}
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1.5,
          height: '100%'
        }}
      >
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={formatMessage({ id: col.titleKey })}
            issues={columnIssues[col.id] || []}
            color={col.color}
            onCardClick={onCardClick}
          />
        ))}
      </Box>
    </DndContext>
  );
};

export default KanbanBoard;
