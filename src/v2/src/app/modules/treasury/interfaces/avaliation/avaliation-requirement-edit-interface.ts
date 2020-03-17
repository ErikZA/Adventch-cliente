import { RequirementAvaliationEditInterface } from '../requirement/requirement-avaliation-edit-interface';

export interface AvaliationRequirementEditInterface {
  id: number;
  note: number;
  idWeek: number;
  requirement: RequirementAvaliationEditInterface;
}
