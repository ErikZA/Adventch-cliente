import {ObservationRequiremntInterface} from './observation-requirement-interface';

export interface ObservationAvaliationFormInterface {
  id: number;
  requirement: ObservationRequiremntInterface;
  idReferenceEvaliation: number;
  description: string;
  status: number;
}
