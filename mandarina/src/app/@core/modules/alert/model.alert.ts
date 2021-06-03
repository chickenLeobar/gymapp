export type typeAlert = 'success' | 'info' | 'warning' | 'error';
export interface IAlert {
  isBanner?: boolean;
  message: string;
  closable?: boolean;
  type: typeAlert;
  icon?: boolean;
  description?: string;
  id?: string;
}
