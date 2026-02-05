import { TabComponents } from 'routes/TabComponents';
import { StackBarStore, SetActiveMenuIdMode, SetterType, StackBar, NullableId, DetailKeyword } from './stackbar-store.types';
import { cloneElement, Fragment } from 'react';
import { ErrorActiveElement } from '../Custom/ErrorActiveElement';
import { NavItemType } from 'types/menu';
import { CustomContainer } from 'layout/Dashboard/CustomContainer';

// 컴포넌트 인스턴스를 캐시하기 위한 Map
export const componentCache = new Map<string, JSX.Element>();

export class StackBarStoreUtils {
  private set = {} as SetterType;
  private get = {} as () => StackBarStore;

  constructor(set: SetterType, get: () => StackBarStore) {
    this.set = set;
    this.get = get;
  }

  //#region -- [private methods] --

  private getStackBarMenuList() {
    try {
      return this.get().stackbarMenu;
    } catch (e) {
      return [];
    }
  }

  private getActiveMenuId() {
    return this.get().activeMenuId;
  }

  private prev(id: NullableId) {
    const prev = this.getPrevMenu(id);
    this.setActiveMenuId(prev ? prev.id : null);
  }

  private next(id: NullableId) {
    const next = this.getNextMenu(id);
    this.setActiveMenuId(next ? next.id : null);
  }

  private near(id: NullableId) {
    const prev = this.getPrevMenu(id);
    const next = this.getNextMenu(id);

    let near = null;

    if (prev) {
      near = prev.id;
    }

    if (next) {
      near = next.id;
    }

    this.setActiveMenuId(near);
  }

  private setWithTarget(id: NullableId, target: SetActiveMenuIdMode) {
    switch (target) {
      case 'prev':
        this.prev(id);
        break;
      case 'next':
        this.next(id);
        break;
      case 'near':
        this.near(id);
        break;
    }
  }

  //#endregion

  getMenuList() {
    return this.get().menuList;
  }

  getNavMenuById(id: NullableId) {
    const menuList = this.getMenuList();

    const findNavMenuById = (items: NavItemType[]): NavItemType | undefined => {
      for (const item of items) {
        if (item.id === id) {
          return item;
        }

        if (item.children) {
          const found = findNavMenuById(item.children);
          if (found) {
            return found;
          }
        }
      }

      return undefined;
    };

    return findNavMenuById(menuList);
  }

  getStackBarMenu(id: NullableId) {
    const stackbarMenu = this.getStackBarMenuList();
    return stackbarMenu.find((item) => item.id === id);
  }

  getStackBarMenuIdx(id: NullableId) {
    const stackbarMenu = this.getStackBarMenuList();
    return stackbarMenu.findIndex((item) => item.id === id);
  }

  setMenuList(menuList: NavItemType[]) {
    this.set({ menuList });
  }

  setStackBarMenuList(stackbarMenu: StackBar[]) {
    // 제거된 메뉴들의 캐시를 정리
    const currentMenuIds = new Set(stackbarMenu.map((menu) => menu.id).filter(Boolean));
    const cachedMenuIds = Array.from(componentCache.keys());

    cachedMenuIds.forEach((menuId) => {
      if (!currentMenuIds.has(menuId)) {
        componentCache.delete(menuId);
      }
    });

    this.set({ stackbarMenu });
  }

  setActiveMenuId(id: NullableId, target?: SetActiveMenuIdMode | undefined) {
    if (target) {
      this.setWithTarget(id, target);
    } else {
      this.set({ activeMenuId: id });
    }
  }

  getActiveMenu() {
    const stackbarMenu = this.getStackBarMenuList();
    return stackbarMenu.find((item) => item.id === this.getActiveMenuId());
  }

  getActiveMenuIdx() {
    const stackbarMenu = this.getStackBarMenuList();
    return stackbarMenu.findIndex((item) => item.id === this.getActiveMenuId());
  }

  getPrevMenu(id: NullableId) {
    const stackbarMenu = this.getStackBarMenuList();
    return stackbarMenu[this.getStackBarMenuIdx(id) - 1];
  }

  getNextMenu(id: NullableId) {
    const stackbarMenu = this.getStackBarMenuList();
    return stackbarMenu[this.getStackBarMenuIdx(id) + 1];
  }

  getActiveElement() {
    const menuId = this.getActiveMenuId();
    try {
      if (!menuId) {
        throw new Error('activeMenuId is null.');
      }

      // 이미 캐시된 컴포넌트가 있는지 확인
      if (componentCache.has(menuId)) {
        return componentCache.get(menuId)!;
      }

      const Element = TabComponents[menuId];

      if (!Element) {
        throw new Error(`Element not found for menuId: ${menuId}`);
      }

      // 새로운 컴포넌트 인스턴스를 생성하고 캐시에 저장
      const clonedElement = cloneElement(Element, { key: menuId });
      componentCache.set(menuId, clonedElement);

      return clonedElement;
    } catch (error) {
      return <ErrorActiveElement error={error} menuId={menuId} />;
    }
  }

  goto(menuId: string) {
    const distMenu = this.getStackBarMenu(menuId);

    if (distMenu) {
      this.setActiveMenuId(menuId);
    } else {
      this.setStackBarMenuList([...this.getStackBarMenuList(), { ...this.getNavMenuById(menuId), idx: this.getStackBarMenuList().length }]);
      this.setActiveMenuId(menuId);
    }
  }

  openDetailElement({ type, id, title, element }: { type: DetailKeyword; id: string; title: string; element: JSX.Element }) {
    const menuId = `${type}:${id}`;
    this.setActiveMenuId(menuId);
    if (TabComponents[menuId]) {
      return;
    }
    const inputMenu: StackBar = {
      id: menuId,
      title,
      idx: this.getStackBarMenuList().length,
      isDetail: true
    };
    this.setStackBarMenuList([...this.getStackBarMenuList(), inputMenu]);
    TabComponents[menuId] = element;
  }

  closeCurrentTab() {
    const stackbarMenu = this.getStackBarMenuList();
    const activeMenuId = this.getActiveMenuId();
    const activeMenuIdx = this.getStackBarMenuIdx(activeMenuId);
    this.setStackBarMenuList(stackbarMenu.filter((menu) => menu.id !== activeMenuId));
    if (activeMenuIdx > 0) {
      this.setActiveMenuId(stackbarMenu[activeMenuIdx - 1].id);
    }
    if (activeMenuId && stackbarMenu[activeMenuIdx].isDetail) {
      delete TabComponents[activeMenuId];
      componentCache.delete(activeMenuId);
    }
  }

  getAllElements() {
    const stackbarMenu = this.getStackBarMenuList();
    const activeMenuId = this.getActiveMenuId();

    if (stackbarMenu.length === 0) {
      return <ErrorActiveElement error={new Error('activeMenuId is null.')} menuId={null} />;
    }

    const elements = stackbarMenu
      .map((menu) => {
        const menuId = menu.id;
        if (!menuId) return null;
        const isActive = activeMenuId === menuId;

        try {
          let element: JSX.Element;

          // 캐시 확인
          if (componentCache.has(menuId)) {
            element = componentCache.get(menuId)!;
          } else {
            const Element = TabComponents[menuId];
            if (!Element) {
              throw new Error(`Element not found for menuId: ${menuId} (${menu.title})`);
            }
            element = cloneElement(Element, { key: menuId });
            componentCache.set(menuId, element);
          }

          return (
            <CustomContainer key={menuId} display={isActive ? 'flex' : 'none'}>
              {element}
            </CustomContainer>
          );
        } catch (error) {
          componentCache.delete(menuId);

          return (
            <CustomContainer key={`error-${menuId}`} display={isActive ? 'flex' : 'none'}>
              <ErrorActiveElement error={error} menuId={menuId} />
            </CustomContainer>
          );
        }
      })
      .filter(Boolean) as JSX.Element[];

    return <Fragment>{elements}</Fragment>;
  }

  updateCurrentTab(updated: boolean) {
    const stackbarMenu = this.getStackBarMenuList();
    const activeMenuId = this.getActiveMenuId();
    const activeMenuIdx = this.getStackBarMenuIdx(activeMenuId);
    this.setStackBarMenuList([
      ...stackbarMenu.slice(0, activeMenuIdx),
      { ...stackbarMenu[activeMenuIdx], hasUpdatedContent: updated },
      ...stackbarMenu.slice(activeMenuIdx + 1)
    ]);
  }
}
