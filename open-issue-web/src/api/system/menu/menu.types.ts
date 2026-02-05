import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface Menu {
  oid: number;
  menuOID?: number;
  name: string;
  description: string;
  ord: number;
  isUse: number;
  link: string;
  menuType?: string | null;
  icon: IconDefinition | string;
  menuRemark: string;
  childMenu: Menu[];
}

type MenuStatus = 'dev';

export const MENU_STATUS: Record<string, MenuStatus> = {
  DEV: 'dev'
} as const;
