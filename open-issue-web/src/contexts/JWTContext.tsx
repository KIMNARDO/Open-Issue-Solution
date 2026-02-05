import React, { createContext, useEffect, useReducer } from 'react';

import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'contexts/auth-reducer/actions';
import authReducer from 'contexts/auth-reducer/auth';

// project import
import Loader from 'components/Loader';
import axios, { loginAxios } from 'utils/axios';
import { KeyedObject } from 'types/root';
import { AuthProps, JWTContextType } from 'types/auth';
import useLibrary from 'hooks/useLibrary';
import libraryService from 'api/system/library/libraryService';
import { BPolicyAuth, DObject } from 'api/common/common.types';

// constant
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null
};

const verifyToken: (st: string) => boolean = (serviceToken) => {
  if (!serviceToken) {
    return false;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  /**
   * Property 'exp' does not exist on type '<T = unknown>(token: string, options?: JwtDecodeOptions | undefined) => T'.
   */
  return decoded.exp > Date.now() / 1000;
};

export const getAccountIdFromToken: (st: string | null) => string = (serviceToken) => {
  if (typeof serviceToken !== 'string') {
    return null;
  }
  const decoded: KeyedObject = jwtDecode(serviceToken);
  return decoded.accountId;
};

const setSession = (serviceToken?: string | null) => {
  if (serviceToken) {
    localStorage.setItem('serviceToken', serviceToken);
    axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
  } else {
    localStorage.removeItem('serviceToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const setRefreshToken = (refreshToken?: string | null) => {
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  } else {
    localStorage.removeItem('refreshToken');
  }
};

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //

export const JWTContext = createContext<JWTContextType | null>(null);

export const JWTProvider = ({ children }: { children: React.ReactElement }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const { setLibrary } = useLibrary();

  useEffect(() => {
    const init = async () => {
      try {
        const serviceToken = window.localStorage.getItem('serviceToken');
        if (serviceToken && verifyToken(serviceToken)) {
          setSession(serviceToken);
          const accountId = getAccountIdFromToken(serviceToken);

          const response = await axios.get(`/user/${accountId}`);
          const user = response.data.result;

          // setLibrary(user.library);

          libraryService.selectSessionLibrary().then((res) => {
            if (res) {
              setLibrary(res);
            }
          });

          dispatch({
            type: LOGIN,
            payload: {
              isLoggedIn: true,
              user
            }
          });
        } else {
          dispatch({
            type: LOGOUT
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: LOGOUT
        });
      }
    };

    init();
  }, [state.isLoggedIn]);

  const login = async (userId: string, password: string) => {
    const response = await loginAxios.post(`/login`, { username: userId, password });

    const { authentication, refreshToken } = response.data.result.token;
    const serviceToken = authentication.split(' ')[1];
    const user = response.data.result;

    setSession(serviceToken);
    setRefreshToken(refreshToken);
    dispatch({
      type: LOGIN,
      payload: {
        isLoggedIn: true,
        user
      }
    });
  };

  const logout = () => {
    setSession(null);
    dispatch({ type: LOGOUT });
  };

  const resetPassword = async (userId: string) => {};

  const hasAuth = (param: Partial<BPolicyAuth> | Partial<BPolicyAuth>[], target: DObject) => {
    const isAuthorized = target.bpolicyAuths?.some((el) => {
      if (Array.isArray(param)) {
        return param.some((p) => Object.entries(p).every(([key, value]) => el[key as keyof BPolicyAuth] === value));
      }
      return Object.entries(param).every(([key, value]) => el[key as keyof BPolicyAuth] === value);
    });
    return isAuthorized;
  };

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return <JWTContext.Provider value={{ ...state, login, logout, resetPassword, hasAuth }}>{children}</JWTContext.Provider>;
};

export default JWTContext;
