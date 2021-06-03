import { Isesion } from './../eventmodels/sesion.model';

import { NormalResponse } from './response';

export interface ISesionResponse extends NormalResponse {
  sesions?: Isesion[];
  sesion: Isesion;
}
