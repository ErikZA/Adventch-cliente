import { AnalystDistrictChurchDataInterface } from './analyst-district-church-data-interface';

export interface DistrictChurchDataInterface {
  id: number;
  name: string;
  analyst: AnalystDistrictChurchDataInterface;
}
