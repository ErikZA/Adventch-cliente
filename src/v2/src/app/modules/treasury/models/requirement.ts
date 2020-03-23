import { Unit } from '../../../shared/models/unit.model';

export class Requirement {
  id: number;
  position: number;
  name: string;
  description: string;
  score: number;
  evaluationTypeId: number;
  removed: boolean;
  unitid: number;
  hasAvaliation: boolean;

  unit: Unit;
  date: Date;
  constructor() { }
}

