import { IUser } from '@core/models/User';
export interface ICredit {
  id: string;

  currentCredits: number;

  referrealCredits: number;

  updateCredits: Date;

  historial: Promise<IHistorialCredit[]>;
}

export interface IHistorialCredit {
  id?: number;

  reason?: string;

  emit?: Date;

  credits?: number;

  id_credit?: string;
}

export type TypeStateRequest = 'APPROVED' | 'PENDDING';
export interface IReuestCredit {
  id?: number;

  id_credit?: string;

  credits?: number;

  description?: string;

  created?: Date;

  responsable?: IUser;

  id_responsable?: number;

  state?: TypeStateRequest;
}
