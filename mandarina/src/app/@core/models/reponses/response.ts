import { IResource } from '../eventmodels/resource.model';
export interface Ierror {
  code: number;
  message: string;
}

export interface NormalResponse {
  resp?: boolean;
  errors?: Ierror[];
}

export interface FileResponse extends NormalResponse {
  path?: string;
}

export interface ResourceResponse extends NormalResponse {
  resource?: IResource;
}
