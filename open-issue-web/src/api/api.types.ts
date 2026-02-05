import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface AxiosResult<T> {
  code: number;
  count: number;
  message: string;
  page: number;
  pageSize: number;
  result: T;
  rowCountPerPage: number;
  totalCount: number;
  type: string;
}

export interface MethodInstance {
  get<T>(url: string, config?: AxiosRequestConfig<any> | undefined): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig<any> | undefined): Promise<T>;
  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<T>;
  postRaw<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<AxiosResult<T>>>;
  postBlob<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<AxiosResult<T>>>;
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<T>;
  patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<T>;
}
