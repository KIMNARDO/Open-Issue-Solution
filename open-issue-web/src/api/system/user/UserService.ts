import ServiceBase from 'api/ServiceBase';
import { GwDepartment, Organization, User, UserPartialType, UserValidationType } from './user.types';
import { RcTreeNode } from 'components/treeView/RcTreeview';

class UserService extends ServiceBase {
  getUsers({ params }: { params: UserPartialType }) {
    return this.service.post<User[]>('users', params);
  }

  getUserById({ oid }: { oid: number }) {
    return this.service.post<User>(`user/${oid}`);
  }

  getOrganization() {
    return this.service.get<Organization>('organization');
  }

  updateUser(payload: User) {
    return this.service.post<User>(`user/update`, payload);
  }

  updateUserPassword(payload: Partial<User>) {
    return this.service.post<User>(`user/modifyPassword`, payload);
  }

  registUser(payload: Partial<User>) {
    return this.service.post<User>(`user/insert`, payload);
  }

  removeUser(oid: number) {
    return this.service.post<User>(`user/delete`, { oid });
  }

  /**
   * @deprecated
   */
  getUserByUid({ userUid }: { userUid: number }) {
    return this.service.post<User>(`user/findUserByKey/${userUid}`);
  }

  /**
   * @deprecated
   */
  getDeptUsers() {
    return this.service.post<RcTreeNode<UserValidationType>>(`user/dept/member`);
  }

  /**
   * @deprecated
   */
  getDepts() {
    return this.service.post<GwDepartment[]>(`user/dept`, {});
  }

  /**
   * @deprecated
   */
  mergeUser({ data }: { data: UserValidationType[] }) {
    return this.service.post<User[]>(`user/batch`, data);
  }

  /**
   * @deprecated
   */
  modifyUser({ data }: { data: UserValidationType }) {
    return this.service.post<User>(`user/modify`, data);
  }

  /**
   * @deprecated
   */
  createUser({ data }: { data: UserValidationType }) {
    return this.service.post<UserValidationType>(`user/registration`, data);
  }

  /**
   * @deprecated
   */
  deleteUser({ userUid }: { userUid: number }) {
    return this.service.post<User>(`user/remove`, { userUid });
  }

  /**
   * @deprecated
   */
  inactiveUser({ userUid }: { userUid: number }) {
    return this.service.post<User>(`user/inactive`, { userUid });
  }

  /**
   * @deprecated
   */
  modifyUserPassword({ userUid, oldPassword, newPassword }: { userUid: number; oldPassword: string; newPassword: string }) {
    return this.service.postRaw<User>(
      `user/modifyPassword`,
      { userUid, oldPassword, newPassword },
      { params: { userUid, oldPassword, newPassword } }
    );
  }

  /**
   * @deprecated
   */
  initializeUserPassword({ userUid }: { userUid: number }) {
    return this.service.post<User>(`user/initializePassword`, { userUid }, { params: { userUid } });
  }
}

export default new UserService();
