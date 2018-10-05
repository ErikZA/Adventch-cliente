import { AvaliationRequirementAvaliationFormInterface } from './avaliation-requirement-avaliation-form-interface';

export interface UpdateAvaliationInterface {
  dateArrival: Date;
  idUser: number;
  avaliationRequirements: AvaliationRequirementAvaliationFormInterface[];
}
