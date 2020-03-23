import { ChurchObservationDataInterface } from './church-observation-data-interface';
import { ObservationRequiremntInterface } from './observation-requirement-interface';

export interface ObservationDataInterface {
  id: number;
  description: string;
  status: number;
  date: Date;
  responsibleName: string;
  church: ChurchObservationDataInterface;
  requirement: ObservationRequiremntInterface;
  idReferenceEvaliation: number;
}
