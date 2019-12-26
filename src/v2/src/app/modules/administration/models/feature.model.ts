import { Permission } from '../../../shared/models/permission.model';
import { EModules } from '../../../shared/models/modules.enum';
import { EPermissions } from '../../../shared/models/permissions.enum';

export class Feature {
  public id: number;
  public name: string;
  public software: EModules;
  public isActive: boolean;
  public isSpecial: boolean;
  public permissions: Permission[];
}
