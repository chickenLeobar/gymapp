import { NormalResponse } from './response';
import { IUser } from '../User';
export interface UserResponse extends NormalResponse {
  user?: IUser;
}
