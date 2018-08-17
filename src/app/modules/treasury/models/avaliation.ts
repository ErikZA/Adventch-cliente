import { EAvaliationStatus } from './Enums';
import { User } from '../../../shared/models/user.model';
import { Church } from './church';
import { Unit } from '../../../shared/models/unit.model';

export class Avaliation {
  id: number;
  date: Date;
  status: EAvaliationStatus;
  user: User;
  unit: Unit;
  church: Church;
  constructor() { }
}

