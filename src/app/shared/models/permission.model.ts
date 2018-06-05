import { EModules } from './modules.enum';

export class Permission {
  public module: EModules;
  public value: number;
  public access: boolean;
}
