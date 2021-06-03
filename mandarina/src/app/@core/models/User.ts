import { ICredit } from './credits.model';
import { IEvent } from '@core/models/eventmodels/event.model';
import { ERol } from '@services/rol.service';
export interface IUser {
  id?: number;
  email?: string;
  password?: string;
  code?: string;
  phone?: string;
  name?: string;
  lastName?: string;
  rol?: ERol[];
  birth?: Date;
  image?: string;
  description?: string;
  eventsCreated?: IEvent[];
  getCompleteName?: string;
  sponsor?: string;
  create?: Date;
  comfirmed?: boolean;
  credit?: ICredit;
}

// user for report list_users

export interface IUserView1 extends IUser {
  online?: boolean;
  suspended?: boolean;
  credits?: number;
  referrealCredits?: number;
  lastTimeActive?: Date;
  id_credit?: string;
}
