import { useState } from 'react';
import { Menu } from '@mui/material';
import { useTheme } from '@mui/material';
import { ContextMenuItem } from 'layout/Dashboard/Drawer/StackBar/ContextMenu/ContextMenuItem';

/**
 * 컨텍스트 메뉴 옵션 인터페이스
 * @property label - 메뉴 항목에 표시될 텍스트
 * @property onClick - 메뉴 항목이 클릭될 때 실행되는 콜백 함수
 * @property disabled - 메뉴 항목을 비활성화하는 선택적 플래그
 */
export interface ContextMenuOption {
  label: string;
  onClick: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

/**
 * 컨텍스트 메뉴 훅의 속성 인터페이스
 * @property onClose - 메뉴가 닫힐 때 실행되는 선택적 콜백
 */
export interface UseContextMenuProps {
  onClose?: () => void;
}

/**
 * 컨텍스트 메뉴 상태와 동작을 관리하는 커스텀 훅
 * @param props - 메뉴 옵션과 닫기 콜백을 포함하는 속성
 * @returns 메뉴 상태와 핸들러를 포함하는 객체
 */
export const useContextMenu = ({ onClose }: UseContextMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [mouseX, setMouseX] = useState<number | null>(null);
  const [mouseY, setMouseY] = useState<number | null>(null);

  const handleOpen = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    setMouseX(event.clientX);
    setMouseY(event.clientY);
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
    onClose?.();
  };

  return {
    menuOpen,
    mouseX,
    mouseY,
    handleOpen,
    handleClose
  };
};

/**
 * Material-UI 메뉴를 렌더링하는 컨텍스트 메뉴 컴포넌트
 * @param props - 메뉴 옵션, 앵커 요소, 열림 상태 및 닫기 콜백을 포함하는 속성
 * @returns 지정된 옵션을 가진 Material-UI 메뉴 컴포넌트
 */
export const ContextMenu = ({
  options,
  mouseX,
  mouseY,
  open,
  onClose
}: UseContextMenuProps & {
  options: ContextMenuOption[];
  mouseX: number | null;
  mouseY: number | null;
  open: boolean;
}) => {
  const { handleClose } = useContextMenu({
    onClose
  });

  const theme = useTheme();

  return (
    <Menu
      open={open}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={mouseY !== null && mouseX !== null ? { top: mouseY, left: mouseX } : undefined}
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
      {options.map((item, idx) => (
        <ContextMenuItem
          key={`context-menu-${idx}`}
          color={theme.palette.primary}
          title={item.label}
          action={() => {
            item.onClick();
            handleClose();
          }}
          icon={item.icon}
          disabled={item.disabled}
        />
      ))}
    </Menu>
  );
};
