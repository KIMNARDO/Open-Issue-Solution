import React, { useState } from 'react';
import { Box, Card, CardContent, CardHeader, Typography, Paper } from '@mui/material';
import { DndContext, closestCenter, DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { useDroppable, useDraggable } from '@dnd-kit/core';

export type KanbanItemBase = {
  id: string;
  status: string;
  title?: string;
  [key: string]: any;
};

export type KanbanOptions = {
  width?: string | number;
  height?: string | number;
  columnGap?: number;
  columnWidth?: string | number;
};

export type KanbanProps<T extends KanbanItemBase> = {
  statusDef: string[];
  data: T[];
  onDrop: (data: T) => void;
  options?: KanbanOptions;
};

function DraggableCard<T extends KanbanItemBase>({ item }: { item: T }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: item.id });
  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
    marginBottom: 8
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      <Card variant="outlined" sx={{ minWidth: 200 }}>
        <CardHeader title={item.title ?? `#${item.id}`} titleTypographyProps={{ variant: 'subtitle2' }} />
        <CardContent>
          <Typography variant="body2">{String(item.description ?? '')}</Typography>
        </CardContent>
      </Card>
    </div>
  );
}

function DroppableColumn({ id, children }: { id: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const style: React.CSSProperties = {
    backgroundColor: isOver ? '#f0f0f0' : undefined,
    padding: 2,
    minHeight: 20,
    height: '100%'
  };
  return (
    <Box ref={setNodeRef} sx={style}>
      {children}
    </Box>
  );
}

export default function KanbanBoard<T extends KanbanItemBase>({ statusDef, data, onDrop, options }: KanbanProps<T>) {
  const [itemsByStatus, setItemsByStatus] = useState<Record<string, T[]>>(() => {
    const initial: Record<string, T[]> = {};
    for (const s of statusDef) initial[s] = [];
    for (const d of data) {
      if (!initial[d.status]) initial[d.status] = [];
      initial[d.status].push(d);
    }
    return initial;
  });

  const [activeItem, setActiveItem] = useState<T | null>(null);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const foundItem = Object.values(itemsByStatus)
      .flat()
      .find((it) => it.id === active.id);
    setActiveItem(foundItem ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const activeContainer = Object.keys(itemsByStatus).find((status) => itemsByStatus[status].some((it) => it.id === activeId));
    const destContainer = overId.replace(/^column:/, '');
    if (!activeContainer || !destContainer) return;
    if (activeContainer === destContainer) return;

    const sourceList = [...itemsByStatus[activeContainer]];
    const destList = [...itemsByStatus[destContainer]];

    const index = sourceList.findIndex((it) => it.id === activeId);
    if (index === -1) return;

    const [moved] = sourceList.splice(index, 1);
    moved.status = destContainer;
    destList.push(moved);

    setItemsByStatus((prev) => ({ ...prev, [activeContainer]: sourceList, [destContainer]: destList }));
    onDrop(moved);
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: options?.columnGap ?? 12,
    width: options?.width ?? '100%',
    height: options?.height ?? 'auto',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 1
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={containerStyle}>
        {statusDef.map((status) => (
          <Paper
            key={status}
            elevation={1}
            sx={{
              // minWidth: options?.columnWidth ?? 260,
              // maxWidth: options?.columnWidth ?? 320,
              p: 1,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              flex: 1
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {status}
            </Typography>
            <DroppableColumn id={`column:${status}`}>
              {itemsByStatus[status].map((item) => (
                <DraggableCard key={item.id} item={item} />
              ))}
            </DroppableColumn>
          </Paper>
        ))}
      </Box>

      {activeItem && (
        <DragOverlay>
          <DraggableCard item={activeItem} />
        </DragOverlay>
      )}
    </DndContext>
  );
}

/*
- 각 카드에 useDraggable 적용, 컬럼에 useDroppable 적용
- DragOverlay 지원
- 컬럼 배경색은 드래그 오버 시 변경
- 같은 컬럼 내 순서 변경은 아직 미지원
*/
