import ServiceBase from 'api/ServiceBase';
import { Menu } from './menu.types';

// 개발 모드 인증 우회 설정
const DEV_BYPASS_AUTH = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

// Mock 메뉴 데이터 (Open Issue 중심) - nameKey는 번역 키
const mockMenuData: Menu[] = [
  {
    oid: 3,
    name: 'menu-dashboard',
    description: 'menu-dashboard-desc',
    ord: 0,
    isUse: 1,
    link: '/dashboard',
    icon: 'DashboardOutlined',
    menuRemark: '',
    childMenu: []
  },
  {
    oid: 1,
    name: 'menu-qms',
    description: 'menu-qms-desc',
    ord: 1,
    isUse: 1,
    link: '',
    icon: 'FileProtectOutlined',
    menuRemark: '',
    childMenu: [
      {
        oid: 11,
        menuOID: 1,
        name: 'menu-open-issue',
        description: 'menu-open-issue-desc',
        ord: 1,
        isUse: 1,
        link: '/Qms/OpenIssueList',
        icon: 'UnorderedListOutlined',
        menuRemark: '',
        childMenu: []
      }
    ]
  },
  {
    oid: 2,
    name: 'menu-system',
    description: 'menu-system-desc',
    ord: 2,
    isUse: 1,
    link: '',
    icon: 'SettingOutlined',
    menuRemark: '',
    childMenu: [
      {
        oid: 21,
        menuOID: 2,
        name: 'menu-user-manage',
        description: 'menu-user-manage',
        ord: 1,
        isUse: 1,
        link: '/Manage/UserManage',
        icon: 'TeamOutlined',
        menuRemark: '',
        childMenu: []
      },
      {
        oid: 22,
        menuOID: 2,
        name: 'menu-auth-manage',
        description: 'menu-auth-manage',
        ord: 2,
        isUse: 1,
        link: '/Manage/AuthManage',
        icon: 'SafetyOutlined',
        menuRemark: '',
        childMenu: []
      },
      {
        oid: 23,
        menuOID: 2,
        name: 'menu-library-manage',
        description: 'menu-library-manage',
        ord: 3,
        isUse: 1,
        link: '/Manage/LibraryManage',
        icon: 'BookOutlined',
        menuRemark: '',
        childMenu: []
      },
      {
        oid: 24,
        menuOID: 2,
        name: 'menu-calendar-manage',
        description: 'menu-calendar-manage',
        ord: 4,
        isUse: 1,
        link: '/Manage/CalendarManage',
        icon: 'CalendarOutlined',
        menuRemark: '',
        childMenu: []
      }
    ]
  }
];

class MenuService extends ServiceBase {
  getMenuList() {
    // 개발 모드에서는 Mock 데이터 반환
    if (DEV_BYPASS_AUTH) {
      console.log('[DEV MODE] Mock 메뉴 데이터 반환');
      return Promise.resolve(mockMenuData);
    }
    return this.service.get<Menu[]>(`menu`);
  }

  getMenuByUserUid({ userUid }: { userUid: number }) {
    // 개발 모드에서는 Mock 데이터 반환
    if (DEV_BYPASS_AUTH) {
      console.log('[DEV MODE] Mock 메뉴 데이터 반환 (userUid:', userUid, ')');
      return Promise.resolve(mockMenuData);
    }
    return this.service.get<Menu[]>(`menu/findMenus/${userUid}`);
  }
}

export default new MenuService();
