import { ListItemIcon, ListItemText, MenuItem, PaletteColorOptions, useTheme } from '@mui/material';

interface ContextMenuItemProps {
  title: string;
  action: () => void;
  icon: React.ReactNode;
  color: PaletteColorOptions;
  disabled?: boolean;
}

export const ContextMenuItem = ({ title, action, icon, color, disabled }: ContextMenuItemProps) => {
  const theme = useTheme();

  return (
    <MenuItem
      onClick={action}
      sx={{
        color: theme.palette.augmentColor({ color }).main,
        fontWeight: 500,
        borderRadius: 1,
        '&:hover': {
          bgcolor: theme.palette.action.hover,
          color: theme.palette.augmentColor({ color }).dark
        },
        minHeight: 40,
        px: 2
      }}
      disabled={disabled}
    >
      <ListItemIcon sx={{ color: theme.palette.augmentColor({ color }).main, minWidth: 32 }}>{icon}</ListItemIcon>
      <ListItemText primary={title} primaryTypographyProps={{ fontSize: 15 }} />
    </MenuItem>
  );
};
