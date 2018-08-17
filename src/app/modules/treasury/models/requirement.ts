import { Unit } from '../../../shared/models/unit.model';

export class Requirement {
  id: number;
  position: number;
  name: string;
  description: string;
  score: number;
  isAnual: boolean;
  removed: boolean;
  unit: Unit;
  date: Date;
  constructor() { }
}

