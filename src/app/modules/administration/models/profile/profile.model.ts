import { Feature } from '../feature.model';
import { EModules } from '../../../../shared/models/modules.enum';
import { IProfile } from './IProfile';

export class Profile implements IProfile {
  constructor(
    public id: number,
    public name: string,
    public software: EModules,
    public features: Feature[]
  ) { }
}
