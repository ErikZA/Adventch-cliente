import { AvaliationRequirementEditInterface } from './avaliation-requirement-edit-interface';

export interface AvaliationEditInterface {
    id: number;
    dateArrival: Date;
    avaliationsRequirements: AvaliationRequirementEditInterface[];
}
