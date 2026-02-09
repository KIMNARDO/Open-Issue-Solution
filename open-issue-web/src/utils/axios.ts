import axios, { AxiosRequestConfig } from 'axios';

// 개발 모드 인증 우회 설정
const DEV_BYPASS_AUTH = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

const axiosServices = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL });
export const loginAxios = axios.create({ baseURL: import.meta.env.VITE_APP_API_URL });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

axiosServices.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response) => {
    const resCode = response.data.code;
    if (response.data.code && resCode !== 0) {
      response.status = 500;
      response.statusText = response.data.message;
      return Promise.reject(response);
    }
    return response;
  },
  (error) => {
    // 개발 모드에서는 401 에러 시 리다이렉트 하지 않음
    if (DEV_BYPASS_AUTH) {
      console.log('[DEV MODE] API 에러 무시:', error.response?.status, error.config?.url);
      return Promise.reject(error);
    }
    if (error.response?.status === 401 && (!window.location.href.includes('login') || window.location.pathname !== '/')) {
      localStorage.removeItem('serviceToken');
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.get(url, { ...config });

  return res.data;
};

export const fetcherPost = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosServices.post(url, { ...config });

  return res.data;
};
