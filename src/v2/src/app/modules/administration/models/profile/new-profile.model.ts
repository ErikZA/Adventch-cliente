import { IProfile } from './IProfile';
import { EModules } from '../../../../shared/models/modules.enum';
import { Feature } from '../feature.model';

export class NewProfile implements IProfile {
  constructor(
    public name: string,
    public software: EModules,
    public idUnit: number,
    public isActive: boolean,
    public features: any[]
  ) { }
}
