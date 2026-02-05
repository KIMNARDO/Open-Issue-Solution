import { BPolicyAuth, DObject } from 'api/common/common.types';
import { User } from 'api/system/user/user.types';
import { ReactElement } from 'react';

// ==============================|| AUTH TYPES ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: User | null;
  token?: string | null;
}

export interface AuthActionProps {
  type: string;
  payload?: AuthProps;
}

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: User | null | undefined;
}

export interface JWTDataProps {
  userId: string;
}

export type JWTContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: User | null | undefined;
  logout: () => void;
  login: (userId: string, password: string) => Promise<void>;
  resetPassword: (userId: string) => Promise<void>;
  hasAuth: (param: Partial<BPolicyAuth>, target: DObject) => boolean;
};
