import { Unit } from '../../../shared/models/unit.model';
import { City } from '../../../shared/models/city.model';

export class Church {
  id: number;
  codeId: string;
  unit: Unit;
  city: City;
  address: string;
  CEP: string;
  name: string;
  code: string;
  district: string;
  constructor() { }
}

