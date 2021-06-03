import { IResource } from '@core/models/eventmodels/resource.model';

export interface Icategorie {
  id?: number;

  name: string;

  description: string;

  image?: IResource;

  id_image?: number;

  countEvents?: number;

  countPrograms?: number;

  createCategorie?: Date;
}

export interface IcategorieView {}
