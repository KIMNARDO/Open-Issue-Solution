export interface Payload {
  [key: string]: any;
}

export interface BlobPayload<T = any> {
  data: T;
  [key: string]: any;
}
