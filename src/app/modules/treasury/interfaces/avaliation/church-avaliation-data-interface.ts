import { AvaliationDataInterface } from './avaliation-data-interface';
import { TreasurerAvaliationDataInterface } from './treasurer-avaliation-data-interface';
import { DistrictChurchAvaliationDataInterface } from '../district/district-church-avaliation-data-interface';
import { AvaliationScoreDataInterface } from './avaliantion-score-data-interface';
export interface ChurchAvaliationDataInterface {
  id: number;
  code: string;
  name: string;
  district: DistrictChurchAvaliationDataInterface;
  avaliations: AvaliationDataInterface[];
  avaliationScore: AvaliationScoreDataInterface;
  treasurers: TreasurerAvaliationDataInterface[];
}
