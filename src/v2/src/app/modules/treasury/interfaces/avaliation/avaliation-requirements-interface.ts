import { AvaliationRequirementEditInterface } from './avaliation-requirement-edit-interface';

export interface AvaliationRequirementsInterface {
    id: number;
    status: number;
    date: Date;
    avaliationsRequirements: AvaliationRequirementEditInterface[];
}
