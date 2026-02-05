import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { StackBarStoreUtils } from './StackBarStoreClass';
import { SetterType, StackBarStore } from './stackbar-store.types';

const initializer = (set: SetterType, get: () => StackBarStore): StackBarStore => {
  const utils = new StackBarStoreUtils(set, get);

  return {
    menuList: [],
    stackbarMenu: [],
    activeMenuId: null,

    setMenuList: utils.setMenuList.bind(utils),
    setStackBarMenu: utils.setStackBarMenuList.bind(utils),
    setActiveMenuId: utils.setActiveMenuId.bind(utils),
    getNavMenuById: utils.getNavMenuById.bind(utils),
    getActiveMenu: utils.getActiveMenu.bind(utils),
    getActiveMenuIdx: utils.getActiveMenuIdx.bind(utils),
    getStackBarMenu: utils.getStackBarMenu.bind(utils),
    getStackBarMenuIdx: utils.getStackBarMenuIdx.bind(utils),
    getPrevMenu: utils.getPrevMenu.bind(utils),
    getNextMenu: utils.getNextMenu.bind(utils),
    getActiveElement: utils.getActiveElement.bind(utils),
    goto: utils.goto.bind(utils),
    getAllElements: utils.getAllElements.bind(utils),
    openDetailElement: utils.openDetailElement.bind(utils),
    closeCurrentTab: utils.closeCurrentTab.bind(utils),
    updateCurrentTab: utils.updateCurrentTab.bind(utils)
  };
};

export const useStackBar = create<StackBarStore, [['zustand/persist', 'zustand/persist']]>(
  persist(initializer, {
    name: 'stack-bar-store',
    storage: createJSONStorage(() => localStorage)
  })
);
