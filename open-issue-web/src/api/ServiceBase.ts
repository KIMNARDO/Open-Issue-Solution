import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosServices from 'utils/axios';
import { AxiosResult, MethodInstance } from './api.types';
import { convertToBlobPayload, payloadOptimization } from 'utils/commonUtils';

class ServiceBase {
  public service: MethodInstance;

  constructor() {
    this.service = {
      get: this.get.bind(this),
      delete: this.delete.bind(this),
      post: this.post.bind(this),
      postRaw: this.postRaw.bind(this),
      postBlob: this.postBlob.bind(this),
      put: this.put.bind(this),
      patch: this.patch.bind(this)
    };
  }

  private get<T>(url: string, config?: AxiosRequestConfig<any> | undefined): Promise<T> {
    if (config && config.params) {
      config.params = payloadOptimization(config.params);
    }

    return axiosServices.get<AxiosResult<T>>(url, config).then((res) => res.data.result);
  }

  private delete<T>(url: string, config?: AxiosRequestConfig<any> | undefined): Promise<T> {
    if (config && config.params) {
      config.params = payloadOptimization(config.params);
    }

    return axiosServices.delete<AxiosResult<T>>(url, config).then((res) => res.data.result);
  }

  private post<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<T> {
    return axiosServices.post<AxiosResult<T>>(url, payloadOptimization(data), config).then((res) => res.data.result);
  }

  private postRaw<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<AxiosResult<T>>> {
    return axiosServices.post<AxiosResult<T>>(url, payloadOptimization(data), config);
  }

  private postBlob<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<AxiosResponse<AxiosResult<T>>> {
    return axiosServices.post<AxiosResult<T>>(url, convertToBlobPayload(data), config);
  }

  private put<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<T> {
    return axiosServices.put<AxiosResult<T>>(url, payloadOptimization(data), config).then((res) => res.data.result);
  }

  private patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig<any> | undefined): Promise<T> {
    return axiosServices.patch<AxiosResult<T>>(url, payloadOptimization(data), config).then((res) => res.data.result);
  }
}

export default ServiceBase;
