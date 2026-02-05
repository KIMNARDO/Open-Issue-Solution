import ServiceBase from 'api/serviceBase';
import { Auth, AuthGroup, ProductAuth, SearchAuthGroup } from './auth.types';
import { User } from '../user/user.types';

class AuthService extends ServiceBase {
  getAuthGroupList({ params }: { params: SearchAuthGroup }) {
    return this.service.post<AuthGroup[]>(`user/group`, params);
  }

  findProductAuth({ userUid }: { userUid: number }) {
    return this.service.get<ProductAuth[]>(`user/product/authority/${userUid}`);
  }

  modifyProductAuth({ auths }: { auths: ProductAuth[] }) {
    return this.service.post<ProductAuth[]>(`user/product/authority/execInitialize`, auths);
  }

  findGroupAuth({ grpUid }: { grpUid: number }) {
    return this.service.get<Auth[]>(`user/group/authority/findGroupAuthority/${grpUid}`);
  }

  registAuthGroup({ params }: { params: SearchAuthGroup }) {
    return this.service.post<AuthGroup>(`user/group/registration`, params);
  }

  modifyAuthGroup({ params }: { params: SearchAuthGroup }) {
    return this.service.post<AuthGroup>(`user/group/modify`, params);
  }

  authInitialize({ grpUid }: { grpUid: number }) {
    return this.service.post<Auth[]>(`user/group/authority/execInitialize`, { grpUid }, { params: { grpUid } });
  }

  removeAuthGroup({ grpUid }: { grpUid: number }) {
    return this.service.post<AuthGroup[]>(`user/group/remove`, { grpUid }, { params: { grpUid } });
  }

  findAuthGroupMember({ grpUid }: { grpUid: number }) {
    return this.service.post<User[]>(`user/group/member/${grpUid}`);
  }

  findOtherGroupMember({ grpUid }: { grpUid: number }) {
    return this.service.get<User[]>(`user/group/member/findGroupOtherMembers/${grpUid}`);
  }

  registAuthGroupMember({ grpUid, userUids }: { grpUid: number; userUids: number[] }) {
    return this.service.post<User[]>(`user/group/member/registration/batch/${grpUid}`, userUids);
  }

  removeAuthGroupMember({ grpUid, userUids }: { grpUid: number; userUids: number[] }) {
    return this.service.post<User[]>(`user/group/member/remove/batch/${grpUid}`, userUids);
  }

  modifyGroupAuth({ auths }: { auths: Auth[] }) {
    return this.service.post<Auth[]>(`user/group/authority/batch`, auths);
  }

  registerGroupAuth({ auth }: { auth: Auth }) {
    return this.service.post<Auth>(`user/group/authority/registration`, auth);
  }
}

export default new AuthService();
