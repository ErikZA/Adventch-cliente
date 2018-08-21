import { EAvaliationStatus } from './Enums';
import { User } from '../../../shared/models/user.model';
import { Church } from './church';
import { Unit } from '../../../shared/models/unit.model';
import { Treasurer } from './treasurer';
import { AvaliationRequirement } from './avaliationRequirement';

export class Avaliation {
  id: number;
  date: Date;
  status: EAvaliationStatus;
  user: User;
  unit: Unit;
  church: Church;
  avaliationsRequirements: Array<AvaliationRequirement>
  constructor() { }
}

//Mapeado conforme viewModel
export class AvaliationList {
  id: number;
  total: number;
  status: number;
  date: Date;
  church: Church;
  treasurers: Array<Treasurer>;
  constructor() { }
}