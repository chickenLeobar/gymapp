export type TypeNotification = 'EVENT' | 'REFER' | 'NORMAL';
export interface Inotification {
  id?: number;
  type: TypeNotification;
  title: string;
  link: string;
  timeCreated: Date;
  read: boolean;
  description: string;
}
