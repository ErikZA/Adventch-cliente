import { AvaliationRequirementAvaliationFormInterfaceWeekly } from "./avaliation-requirement-avaliation-form-interface-weekly";

export interface NewAvaliationInterfaceWeek {
  date: Date;
  dateArrival: Date;
  idChurch: number;
  idUser: number;
  avaliationRequirements: AvaliationRequirementAvaliationFormInterfaceWeekly[];
}
