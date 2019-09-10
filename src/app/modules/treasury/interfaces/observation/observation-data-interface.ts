import { ChurchObservationDataInterface } from './church-observation-data-interface';

export interface ObservationDataInterface {
  id: number;
  description: string;
  status: number;
  date: Date;
  responsibleName: string;
  church: ChurchObservationDataInterface;
}
