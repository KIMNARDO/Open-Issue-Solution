import { List, ListSubheader, ListItemIcon, ListItemButton, ListItemText, Collapse } from '@mui/material';
import { DownOutlined, MinusOutlined, UpOutlined } from '@ant-design/icons';
import React, { MouseEventHandler, useState } from 'react';

export interface ListDataProps {
  text: string;
  url: string;
  icon?: string | React.ReactNode;
  children?: ListDataProps[];
  isParent?: boolean;
}

interface NavListProps {
  dataArr: ListDataProps[];
  title?: string;
  activeItem?: string;
  onItemClick?: (url: string, text: string) => void;
  onItemContextMenu?: (e: React.MouseEvent, url: string, text: string) => void;
}

const ListItem = ({
  text,
  url,
  icon,
  onClick,
  onContextMenu,
  activeItem
}: ListDataProps & {
  activeItem?: string;
  onClick?: (url: string, text: string) => void;
  onContextMenu?: (e: React.MouseEvent, url: string, text: string) => void;
}) => {
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
      sx={{ pl: 3, py: 0, background: activeItem === url ? '#eee' : undefined }}
    >
      <ListItemIcon>
        <MinusOutlined />
        {icon}
      </ListItemIcon>
      <ListItemText>{text}</ListItemText>
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
  activeItem
}: ListDataProps & {
  activeItem?: string;
  onItemClick?: (url: string, text: string) => void;
  onItemContextMenu?: (e: React.MouseEvent, url: string, text: string) => void;
}) => {
  const [open, setOpen] = useState<boolean>(true);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!open);
  };
  const handleClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    onItemClick?.(url, text);
  };
  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ pl: 0, py: 0.5, background: activeItem === url ? '#eee' : undefined }}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={text}
          sx={{
            '& .MuiListItemText-primary': {
              fontWeight: 'bold'
            }
          }}
        />
        {open ? <UpOutlined onClick={handleOpen} /> : <DownOutlined onClick={handleOpen} />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children?.map((e) => {
            return (
              <ListItem
                text={e.text}
                url={e.url}
                icon={e.icon}
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

const NavList = ({ dataArr, title, onItemClick, onItemContextMenu, activeItem }: NavListProps) => {
  return (
    <div
      style={{ overflowY: 'auto', width: '100%', height: '100%', borderRight: '1px solid #ddd' }}
      onContextMenu={(e) => {
        e.preventDefault();
        onItemContextMenu?.(e, '', '');
      }}
    >
      <List sx={{ width: '100%', p: 0 }} component="nav" subheader={title && <ListSubheader component="div">{title}</ListSubheader>}>
        {dataArr.map((e) => {
          return e.isParent || (e.children && e.children.length > 0) ? (
            <ListGroup
              text={e.text}
              url={e.url}
              icon={e.icon}
              children={e.children}
              onItemClick={onItemClick}
              activeItem={activeItem}
              onItemContextMenu={onItemContextMenu}
            />
          ) : (
            <ListItem
              text={e.text}
              url={e.url}
              icon={e.icon}
              onClick={onItemClick}
              onContextMenu={onItemContextMenu}
              activeItem={activeItem}
            />
          );
        })}
      </List>
    </div>
  );
};

export default NavList;
