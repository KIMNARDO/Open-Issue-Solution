import ServiceBase from 'api/ServiceBase';
import { Menu } from './menu.types';

class MenuService extends ServiceBase {
  getMenuList() {
    return this.service.get<Menu[]>(`menu`);
  }

  getMenuByUserUid({ userUid }: { userUid: number }) {
    return this.service.get<Menu[]>(`menu/findMenus/${userUid}`);
  }
}

export default new MenuService();
