import { Modules } from './modules.enum';

export class Permission {
  public module: Modules;
  public value: number;
  public access: boolean;
}
