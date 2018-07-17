import { Unit } from '../../../shared/models/unit.model';
import { City } from '../../../shared/models/city.model';
import { Districts } from './districts';

export class Church {
  id: number;
  codeId: string;
  unit: Unit;
  city: City;
  address: string;
  cep: string;
  name: string;
  code: string;
  district: Districts;
  constructor() { }
}

