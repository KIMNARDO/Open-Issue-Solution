import { Menu, MENU_STATUS } from 'api/system/menu/menu.types';
import { NavItemType } from 'types/menu';

// import * as faIcons from '@fortawesome/free-solid-svg-icons';
import * as antIcons from '@ant-design/icons';

import { ChipProps } from '@mui/material';
import { confirmation } from 'components/confirm/CommonConfirm';
import { User } from 'api/system/user/user.types';

const getDevMenuProps = (isDev: boolean) => {
  const devProps = {
    onMenuClick: () =>
      confirmation({
        title: '개발중',
        msg: '개발중인 화면입니다.',
        buttonProps: {
          cancel: {
            hideBtn: true
          }
        }
      }),
    chip: {
      label: '개발중',
      color: 'error',
      size: 'small'
    } as ChipProps
  };

  return isDev ? devProps : {};
};

export const parseMenuItems = (menuItems: Menu[], user: User): { items: NavItemType[] } => {
  const items: NavItemType[] = [];
  if (menuItems.length < 1) return { items };

  for (const item of menuItems) {
    const node: NavItemType = {
      ...{
        id: item.oid.toString(),
        title: item.name,
        type: !item.menuOID && !item.link ? 'D' : 'M',
        url: item.link,

        // @ts-ignore
        icon: antIcons[item.icon]
      },
      ...getDevMenuProps(item.menuRemark === MENU_STATUS.DEV)
    };

    if (item.childMenu && item.childMenu.length > 0) {
      const children = parseMenuItems(item.childMenu, user).items;
      node.children = children;
    }

    // display
    // if (item.displayAt === 'N') {
    //   continue;
    // }

    // authority
    // const auth = user.groupAuthority?.find((f) => f.menuCd.toString() === node.id);
    // if (auth && auth.viewPermAt === 'Y') {
    //   items.push(node);
    // }
    items.push(node);
  }

  return {
    items
  };
};

// 기본 평탄화 함수 - 특정 필드로 중첩된 객체를 평탄화
export const flattenByField = <T>(obj: T, fieldName: keyof T): T[] => {
  const result: T[] = [];

  function traverse(current: T) {
    result.push(current);
    const nested = current[fieldName];

    if (Array.isArray(nested)) {
      nested.forEach(traverse);
    } else if (nested && typeof nested === 'object') {
      traverse(nested as T);
    }
  }

  traverse(obj);
  return result;
};
