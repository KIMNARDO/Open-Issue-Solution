import { Menu } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useStackBar } from '../store/useStackBar';
import { CloseOutlined, FolderOpenOutlined } from '@ant-design/icons';
import { ContextMenuItem } from './ContextMenuItem';

interface StackBarContextMenuProps {
  contextMenu: {
    mouseX: number;
    mouseY: number;
    open: boolean;
  };
  handleClose: () => void;
}

export const StackBarContextMenu = ({ contextMenu, handleClose }: StackBarContextMenuProps) => {
  const theme = useTheme();
  const { stackbarMenu, activeMenuId, setStackBarMenu, setActiveMenuId } = useStackBar();

  const handleCloseAllStack = () => {
    setActiveMenuId(null);
    setStackBarMenu([]);
    handleClose();
  };

  const handleOpenTargetStack = (target?: string) => {
    setActiveMenuId(target);
    handleClose();
  };

  return (
    <Menu
      open={contextMenu.open}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={contextMenu.open ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
      slotProps={{
        paper: {
          sx: {
            minWidth: 160,
            bgcolor: theme.palette.background.paper,
            boxShadow: theme.shadows[8],
            borderRadius: 1.5,
            p: 0.5,
            border: `1px solid ${theme.palette.divider}`
          }
        }
      }}
      MenuListProps={{
        sx: {
          p: 0
        }
      }}
    >
      {stackbarMenu.map((item) => (
        <ContextMenuItem
          key={item.id}
          color={theme.palette.primary}
          title={`${item.title} 열기${activeMenuId === item.id ? ' (현재 탭)' : ''}`}
          action={() => handleOpenTargetStack(item.id)}
          icon={<FolderOpenOutlined />}
        />
      ))}
      <ContextMenuItem color={theme.palette.error} title="모두 닫기" action={handleCloseAllStack} icon={<CloseOutlined />} />
    </Menu>
  );
};
