import { CloseOutlined } from '@ant-design/icons';
import { Card, CardActions, CardContent, IconButton, Typography, useTheme } from '@mui/material';
import { useStackBar } from './store/useStackBar';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TabComponents } from 'routes/TabComponents';
import { componentCache } from './store/StackBarStoreClass';
import { confirmation } from 'components/confirm/CommonConfirm';

interface StackBarItemProps {
  height: number;
  id: string;
  title: string | React.ReactNode;
}

export const StackBarItem = ({ height, id, title }: StackBarItemProps) => {
  const { activeMenuId, setActiveMenuId, setStackBarMenu, stackbarMenu, getActiveMenu } = useStackBar();
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const handleCloseTab = async () => {
    if (getActiveMenu()?.hasUpdatedContent) {
      const result = await confirmation({
        title: '변경사항 확인',
        msg: '변경사항이 있습니다. 정말로 탭을 닫겠습니까?'
      });
      if (!result) return;
    }
    if (activeMenuId === id) {
      setActiveMenuId(id, 'near');
    }
    const removedMenu = stackbarMenu.find((item) => item.id === id);
    const removed = stackbarMenu.filter((item) => item.id !== id);

    if (removedMenu?.isDetail) {
      delete TabComponents[id];
      componentCache.delete(id);
    }
    setStackBarMenu(removed);
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button == 1) {
      handleCloseTab();
    }
  };

  return (
    <Card
      onMouseDown={handleMouseDown}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      variant="outlined"
      sx={{
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        userSelect: 'none',
        backgroundColor: activeMenuId === id ? theme.palette.background.paper : theme.palette.grey[200],
        cursor: isDragging ? 'grabbing' : 'pointer',
        height: height,
        px: 2,
        py: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        width: 'fit-content',
        boxSizing: 'border-box',
        flex: '0 0 auto',
        opacity: isDragging ? 0.7 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        borderRadius: '4px 4px 0 0',
        margin: '3px 4px 0 0',
        boxShadow: activeMenuId === id ? '1px -1px 2px rgba(0,0,0,.1)' : '0 -1px 2px rgba(0,0,0,0.2) inset',
        borderBottom: 'none'
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '100%'
        }}
        onClick={() => {
          setActiveMenuId(id);
        }}
      >
        <Typography variant="h5">{title}</Typography>
      </CardContent>
      <CardActions>
        <IconButton size="small" sx={{ mr: -2 }} onClick={handleCloseTab}>
          <CloseOutlined />
        </IconButton>
      </CardActions>
    </Card>
  );
};
