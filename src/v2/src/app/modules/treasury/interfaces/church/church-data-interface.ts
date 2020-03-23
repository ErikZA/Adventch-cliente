import { CityChurchDataInterface } from './city-church-data-interface';
import { DistrictChurchDataInterface } from './district-church-data-interface';

export interface ChurchDataInterface {
  id: number;
  code: string;
  name: string;
  address: string;
  complement: string;
  cep: string;
  city: CityChurchDataInterface;
  district: DistrictChurchDataInterface;
  isMonth: boolean;
}
