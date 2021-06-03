export type TypeInstance = 'LOCAL' | 'S3';
export interface IResource {
  id?: number;
  updateResource?: Date;
  key?: string;
  url?: string;
  type?: string;
  acces?: string;
  bucket?: string;
  instace?: TypeInstance;
}
