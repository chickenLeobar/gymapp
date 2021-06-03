import { typID } from '@core/models/types';
import { IUser } from '@core/models/User';
export type typeRender = 'FLOAT' | 'COMPLETE' | 'MOBILE';
export type ChatAvatar = {
  active?: boolean;
  avatar?: string;
  notifications?: number;
  name?: string;
};

export interface IlistMessageItem {
  id: typID;
  name?: string;
  message: string;
  time?: Date;
  avatar: ChatAvatar;
}

export interface IConversationItem {
  reverse: boolean;
  name: string;
  message: string;
  time: Date;
  avatar: ChatAvatar;
}

export interface IRecentMessages {
  id_user: number;
  avatar: string;
  name: string;
  id_conversation: number;
  count_messages: number;
  last_message: string;
  time_message: Date;
  unread_messages: number;
  active_user?: number;
}

export interface IUserChat {
  id: number;
  name: string;
  lastName: string;
  online: boolean;
  description?: string;
  image?: string;
  code?: string;
}

export interface statusChatResponse {
  event: 'CONNECT' | 'DISCONNECT';
  id: number;
  user: IUserChat;
}

export interface IConversation {
  id: number;
  created: Date;
  messages?: IMessage[];
  members?: IUserChat[];
}

export interface IMessage {
  id?: number;
  created?: Date;
  reverse?: boolean;
  read?: boolean;
  message: string;
  avatar?: string;
  name?: string;
  id_conversation?: number;
  creator?: IUser;
  id_creator?: number;
}

// types

export type typeOnlineEvent = 'CONNECT' | 'DISCONNECT';
