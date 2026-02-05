import { ReactNode } from 'react';

// material-ui
import { ChipProps } from '@mui/material';

//import { GenericCardProps } from './root';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export enum NavActionType {
  FUNCTION = 'function',
  LINK = 'link'
}

// ==============================|| MENU TYPES ||============================== //

export type NavActionProps = {
  type: NavActionType;
  label: string;
  function?: any;
  url?: string;
  target?: boolean;
  icon: IconDefinition; //GenericCardProps['iconPrimary'] | string |
};

export type NavType = 'collapse' | 'item' | 'group' | 'D' | 'M';

export type NavItemType = {
  breadcrumbs?: boolean;
  caption?: ReactNode | string;
  children?: NavItemType[];
  elements?: NavItemType[];
  chip?: ChipProps;
  color?: 'primary' | 'secondary' | 'default' | undefined;
  disabled?: boolean;
  external?: boolean;
  isDropdown?: boolean;
  icon?: IconDefinition; //GenericCardProps['iconPrimary'] | string |
  id?: string;
  link?: string;
  search?: string;
  target?: boolean;
  title?: ReactNode | string;
  type?: NavType;
  url?: string | undefined;
  actions?: NavActionProps[];
  onMenuClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
};

export type LinkTarget = '_blank' | '_self' | '_parent' | '_top';

export type MenuProps = {
  /**
   * Indicate if dashboard layout menu open or not
   */
  isDashboardDrawerOpened: boolean;

  /**
   * Indicate if component layout menu open or not
   */
  isComponentDrawerOpened: boolean;
};
