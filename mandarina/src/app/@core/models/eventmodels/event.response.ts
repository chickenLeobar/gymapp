import { IEvent } from './event.model';
import { NormalResponse } from './../reponses/response';

export interface EventResponse extends NormalResponse {
  event?: IEvent;
}
export interface IDetailResponse extends NormalResponse {
  timeAttend?: Date;
}
export interface DetailEventAllResponse extends NormalResponse {
  events?: IEvent[];
}
