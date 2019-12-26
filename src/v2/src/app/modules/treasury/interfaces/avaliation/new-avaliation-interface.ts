import { AvaliationRequirementAvaliationFormInterface } from './avaliation-requirement-avaliation-form-interface';

export interface NewAvaliationInterface {
  date: Date;
  dateArrival: Date;
  idChurch: number;
  idUser: number;
  avaliationRequirements: AvaliationRequirementAvaliationFormInterface[];
}
