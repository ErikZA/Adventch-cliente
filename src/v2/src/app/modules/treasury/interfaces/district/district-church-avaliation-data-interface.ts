import { AnalystDistrictChurchAvaliationDataInterface } from './analyst-district-church-avaliation-data-interface';

export interface DistrictChurchAvaliationDataInterface {
  id: number;
  name: string;
  analust: AnalystDistrictChurchAvaliationDataInterface;
}
