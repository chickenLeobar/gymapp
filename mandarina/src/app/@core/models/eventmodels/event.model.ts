import { JwtService } from './../../../services/jwt.service';
import { AppModule } from './../../../app.module';
import { IResource } from '@models/eventmodels/resource.model';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { SafeUrl } from '@angular/platform-browser';
import { EventState } from 'src/app/@core/models/eventmodels/enums.event';

export interface InteractionEvent {
  id_event: number;
  id_user: number;
}

export interface IEvent {
  id?: number;
  name?: string;
  endEvent?: Date;
  description?: string;
  capacityAssistant?: number;
  createEvent?: Date;
  published?: EventState;
  publishedDate?: Date;
  includeComments?: boolean;
  eventCover: string | SafeUrl;
  sesions?: Isesion[];
  video?: IResource;
  cloudinarySource?: string;
  id_resource?: number;
  includeVideo?: boolean;
  id_comment?: number;
  modeEvent?: MODEEVENT;
  id_user?: number;
  category_id?: number;
  credits?: number;
  interactions: InteractionEvent[];
}

export class BEvent implements IEvent {
  id!: number;
  name!: string;
  endEventid!: Date;
  descriptionid!: string;
  capacityAssistantid!: number;
  createEventid!: Date;
  publishedid!: EventState;
  publishedDateid!: Date;
  includeCommentsid!: boolean;
  eventCover!: string | SafeUrl;
  sesionsid!: Isesion[];
  videoid!: IResource;
  cloudinarySourceid!: string;
  id_resourceid!: number;
  includeVideoid!: boolean;
  id_commentid!: number;
  modeEventid!: MODEEVENT;
  id_userid!: number;
  category_id!: number;
  creditsid!: number;
  credits!: number;
  video!: IResource;
  description!: string;
  includeComments!: boolean;
  id_comment!: number;
  sesions?: Isesion[];
  modeEvent?: MODEEVENT;
  interactions!: InteractionEvent[];
  static instace(source: IEvent) {
    let event = new BEvent();
    event = Object.assign(event, source);
    return event;
  }
  get isMeReaction() {
    const jwtService = AppModule.injector.get(JwtService);
    const user = jwtService.getUserOfToken();

    return this.interactions.some((re) => re.id_user == user.id);
  }

  likeYou() {}
}

export type MODEEVENT = 'EVENT' | 'PROGRAM';
