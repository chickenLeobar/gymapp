export type TypeStateRequest = 'APPROVED' | 'PENDDING';
export interface IRequestCredit {
  id_request?: number;
  state?: TypeStateRequest;
  description?: string;
  userName?: string;
  idUser: number;
  lastName?: string;
  currentCredits?: number;
  referrealCredits?: number;
  id_credit?: string;
  created?: Date;
  id_responsable?: number;
  credits?: number;
}
