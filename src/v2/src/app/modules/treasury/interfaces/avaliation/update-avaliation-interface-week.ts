import { AvaliationRequirementAvaliationFormInterfaceWeekly } from './avaliation-requirement-avaliation-form-interface-weekly';

export interface UpdateAvaliationInterfaceWeekly {
  dateArrival: Date;
  idUser: number;
  avaliationRequirements: AvaliationRequirementAvaliationFormInterfaceWeekly[];
}
