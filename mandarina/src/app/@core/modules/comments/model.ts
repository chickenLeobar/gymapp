import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { IUser } from './../../models/User';
import { Comment } from './models/comment.class';
export interface IComment {
  id?: string;
  createComment?: Date;
  updateComment?: Date;
  comment?: string;
  replies?: IComment[];
  user?: IUser;
  id_user?: number;
  id_comment?: string;
  interaction: IInteractionItem[];
  id_bootstrap?: number;
}

export type InteractionType = 'LIKE';

export interface IInteractionItem {
  id: number;
  id_user: number;
  id_comment: string;
  typeInteraction?: InteractionType;
}
export interface ICommentDisplay extends IComment {
  avatar?: string;
  displayTime?: string;
  author?: string;
}

export interface ICommentSubResponse {
  action?: string;
  comment?: Comment;
}

export type CRUD_ACTION = 'CREATE' | 'DELETE' | 'UPDATE';

export type payloadComment = {
  action: CRUD_ACTION;
  comment: Comment;
};

export enum EnumboxCommentState {
  COLLECTED = 'COLLECTED',
  NORMA = 'NORMAL'
}
