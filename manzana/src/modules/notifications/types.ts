import { Notification, TypeNotification } from "./notifications.entity";
import { ObjectType } from "type-graphql";
import paginatedResponse from "../../types/generic/pagination.type";

@ObjectType()
export class NotifyResponse extends paginatedResponse(Notification) {}
export interface Inotification {
  id?: number;
  type: TypeNotification;
  title: string;
  link: string;
  timeCreated: Date;
  description: string;
}
