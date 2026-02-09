import { List, ListSubheader, ListItemIcon, ListItemButton, ListItemText, Collapse, Box, Chip, useTheme } from '@mui/material';
import { DownOutlined, MinusOutlined, UpOutlined, FolderOutlined, FileOutlined } from '@ant-design/icons';
import React, { MouseEventHandler, useEffect, useState } from 'react';

export interface ListDataProps {
  text: string;
  url: string;
  icon?: string | React.ReactNode;
  children?: ListDataProps[];
  isParent?: boolean;
  count?: number; // 아이템 개수 표시용
}

interface NavListProps {
  dataArr: ListDataProps[];
  title?: string;
  activeItem?: string;
  selectedParent?: string; // 선택된 부모 항목
  onItemClick?: (url: string, text: string) => void;
  onItemContextMenu?: (e: React.MouseEvent, url: string, text: string) => void;
  defaultCollapsed?: boolean; // 기본 접힘 상태
}

const ListItem = ({
  text,
  url,
  icon,
  onClick,
  onContextMenu,
  activeItem,
  count
}: ListDataProps & {
  activeItem?: string;
  onClick?: (url: string, text: string) => void;
  onContextMenu?: (e: React.MouseEvent, url: string, text: string) => void;
}) => {
  const theme = useTheme();
  const isActive = activeItem === url;

  return (
    <ListItemButton
      onClick={() => {
        onClick?.(url, text);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu?.(e, url, text);
      }}
      sx={{
        pl: 3,
        py: 0.75,
        borderRadius: 1,
        mx: 0.5,
        mb: 0.25,
        background: isActive ? theme.palette.primary.lighter : undefined,
        borderLeft: isActive ? `3px solid ${theme.palette.primary.main}` : '3px solid transparent',
        '&:hover': {
          background: isActive ? theme.palette.primary.lighter : theme.palette.action.hover
        }
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }}>
        {icon || <FileOutlined style={{ fontSize: 20, color: theme.palette.grey[500] }} />}
      </ListItemIcon>
      <ListItemText
        primary={text}
        sx={{
          '& .MuiListItemText-primary': {
            fontSize: '0.85rem',
            fontWeight: isActive ? 600 : 400
          }
        }}
      />
      {count !== undefined && count > 0 && (
        <Chip
          label={count}
          size="small"
          sx={{
            height: 18,
            fontSize: '0.7rem',
            bgcolor: theme.palette.grey[200],
            color: theme.palette.grey[700]
          }}
        />
      )}
    </ListItemButton>
  );
};

const ListGroup = ({
  text,
  url,
  icon,
  children,
  onItemClick,
  onItemContextMenu,
  activeItem,
  selectedParent,
  defaultCollapsed = true
}: ListDataProps & {
  activeItem?: string;
  selectedParent?: string;
  onItemClick?: (url: string, text: string) => void;
  onItemContextMenu?: (e: React.MouseEvent, url: string, text: string) => void;
  defaultCollapsed?: boolean;
}) => {
  const theme = useTheme();
  // 선택된 부모이거나 자식 중 선택된 항목이 있으면 펼침
  const hasActiveChild = children?.some((c) => c.url === activeItem);
  const isSelected = selectedParent === url || url === activeItem;
  const [open, setOpen] = useState<boolean>(!defaultCollapsed || isSelected || hasActiveChild);

  // 선택된 항목이 변경되면 해당 그룹 자동 펼침
  useEffect(() => {
    if (hasActiveChild || isSelected) {
      setOpen(true);
    }
  }, [hasActiveChild, isSelected]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };

  const handleClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    // 그룹 클릭 시 토글 + 선택
    setOpen(!open);
    onItemClick?.(url, text);
  };

  const childCount = children?.length || 0;

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{
          pl: 1,
          py: 0.75,
          borderRadius: 1,
          mx: 0.5,
          mb: 0.5,
          background: isSelected ? theme.palette.primary.lighter : undefined,
          '&:hover': {
            background: isSelected ? theme.palette.primary.lighter : theme.palette.action.hover
          }
        }}
      >
        <ListItemIcon sx={{ minWidth: 44 }}>
          {icon || <FolderOutlined style={{ fontSize: 24, color: isSelected ? theme.palette.primary.main : theme.palette.grey[600] }} />}
        </ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            '& .MuiListItemText-primary': {
              fontWeight: 600,
              fontSize: '0.9rem',
              color: isSelected ? theme.palette.primary.main : 'inherit'
            }
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {childCount > 0 && (
            <Chip
              label={childCount}
              size="small"
              color={isSelected ? 'primary' : 'default'}
              sx={{
                height: 20,
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            />
          )}
          {open ? (
            <UpOutlined onClick={handleOpen} style={{ fontSize: 12, color: theme.palette.grey[500] }} />
          ) : (
            <DownOutlined onClick={handleOpen} style={{ fontSize: 12, color: theme.palette.grey[500] }} />
          )}
        </Box>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          {children?.map((e, idx) => {
            return (
              <ListItem
                key={`${e.url}-${idx}`}
                text={e.text}
                url={e.url}
                icon={e.icon}
                count={e.count}
                onClick={onItemClick}
                onContextMenu={onItemContextMenu}
                activeItem={activeItem}
              />
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

const NavList = ({
  dataArr,
  title,
  onItemClick,
  onItemContextMenu,
  activeItem,
  selectedParent,
  defaultCollapsed = true
}: NavListProps) => {
  return (
    <Box
      sx={{
        overflowY: 'auto',
        width: '100%',
        height: '100%',
        borderRight: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        onItemContextMenu?.(e, '', '');
      }}
    >
      <List
        sx={{ width: '100%', p: 0.5 }}
        component="nav"
        subheader={
          title && (
            <ListSubheader component="div" sx={{ bgcolor: 'transparent', fontWeight: 700 }}>
              {title}
            </ListSubheader>
          )
        }
      >
        {dataArr.map((e, idx) => {
          return e.isParent || (e.children && e.children.length > 0) ? (
            <ListGroup
              key={`${e.url}-${idx}`}
              text={e.text}
              url={e.url}
              icon={e.icon}
              children={e.children}
              onItemClick={onItemClick}
              activeItem={activeItem}
              selectedParent={selectedParent}
              onItemContextMenu={onItemContextMenu}
              defaultCollapsed={defaultCollapsed}
            />
          ) : (
            <ListItem
              key={`${e.url}-${idx}`}
              text={e.text}
              url={e.url}
              icon={e.icon}
              count={e.count}
              onClick={onItemClick}
              onContextMenu={onItemContextMenu}
              activeItem={activeItem}
            />
          );
        })}
      </List>
    </Box>
  );
};

export default NavList;
