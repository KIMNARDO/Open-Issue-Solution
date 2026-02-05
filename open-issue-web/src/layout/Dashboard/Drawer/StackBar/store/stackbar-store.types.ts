import { NavItemType } from 'types/menu';

export type NullableId = string | null | undefined;

export interface StackBar extends NavItemType {
  idx: number;
  isDetail?: boolean;
  hasUpdatedContent?: boolean;
}

export interface StackBarStore {
  menuList: NavItemType[];
  stackbarMenu: StackBar[];
  activeMenuId: NullableId;

  setMenuList: (menuList: NavItemType[]) => void;
  setActiveMenuId: (id: NullableId, target?: SetActiveMenuIdMode) => void;
  getNavMenuById: (id: NullableId) => NavItemType | undefined;
  getActiveMenu: () => StackBar | undefined | null;
  getActiveMenuIdx: () => number;
  setStackBarMenu: (stackbar: StackBar[]) => void;
  getStackBarMenu: (id: NullableId) => StackBar | undefined;
  getStackBarMenuIdx: (id: NullableId) => number;
  getPrevMenu: (id: NullableId) => StackBar | undefined;
  getNextMenu: (id: NullableId) => StackBar | undefined;
  getActiveElement: () => JSX.Element | JSX.Element | null;
  goto: (menuId: string) => void;
  getAllElements: () => JSX.Element;
  openDetailElement: ({ type, id, title, element }: { type: DetailKeyword; id: string; title: string; element: JSX.Element }) => void;
  closeCurrentTab: () => void;
  updateCurrentTab: (updated: boolean) => void;
}

export type SetterType = {
  (
    partial: StackBarStore | Partial<StackBarStore> | ((state: StackBarStore) => StackBarStore | Partial<StackBarStore>),
    replace?: false
  ): void;
  (state: StackBarStore | ((state: StackBarStore) => StackBarStore), replace: true): void;
};

export type SetActiveMenuIdMode = 'prev' | 'next' | 'near';

export type DetailKeyword = 'project' | 'document' | 'ebom' | 'eco' | 'ecr' | 'doc-class';
