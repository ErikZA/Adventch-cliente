import { EAvaliationStatus } from './Enums';
import { User } from '../../../shared/models/user.model';
import { Church } from './church';
import { Unit } from '../../../shared/models/unit.model';
import { Treasurer } from './treasurer';
import { AvaliationRequirement } from './avaliationRequirement';

export class Avaliation {
  id: number;
  date: Date;
  dateArrival: Date;
  status: EAvaliationStatus;
  user: User;
  unit: Unit;
  church: Church;
  avaliationsRequirements: Array<AvaliationRequirement>
  constructor() { }
}

//Mapeado conforme viewModel
export class ChurchAvaliation {
  total: number;
  church: Church;
  avaliations: Array<Avaliation>;
  treasurers: Array<Treasurer>;
}