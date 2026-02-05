import { List, ListSubheader, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

export interface DetailNavItem {
  icon?: React.ReactNode;
  id: string;
  label: string;
}

interface DetailNavProps {
  items: DetailNavItem[];
  title?: string;
  currentId?: string;
  onItemClick?: (id: string) => void;
}

const DetailNav = ({ items, title, currentId, onItemClick }: DetailNavProps) => {
  return (
    <List sx={{ width: '100%', p: 0 }} component="nav" subheader={title && <ListSubheader component="div">{title}</ListSubheader>}>
      {items.map((item) => {
        return (
          <ListItemButton
            onClick={() => {
              onItemClick?.(item.id);
            }}
            sx={(theme) => ({
              pl: 2,
              py: 1,
              borderBottom: '1px solid #eee',
              color: currentId === item.id ? theme.palette.primary.main : 'text',
              '& .MuiListItemIcon-root': {
                color: currentId === item.id ? theme.palette.primary.main : 'text'
              },
              backgroundColor: currentId === item.id ? theme.palette.grey[100] : 'transparent'
            })}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText>{item.label}</ListItemText>
          </ListItemButton>
        );
      })}
    </List>
  );
};

export default DetailNav;
