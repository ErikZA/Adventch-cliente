import { Feature } from './feature.model';
import { Funcionality } from './funcionality.model';
import { Unit } from '../../../shared/models/unit.model';
import { EModules } from '../../../shared/models/modules.enum';

export class Role {
  public id: number;
  public name: string;
  public description: string;
  public functionalities: Funcionality[];
  public features: Feature[];
  public unit: Unit;
  public module: EModules; // usado somente para view. Não mapear no banco!
  public removed: boolean;
}
