import { Profile } from './profile.model';
import { Feature } from '../feature.model';
import { EModules } from '../../../../shared/models/modules.enum';

export class EditProfile extends Profile {
  constructor(
    public id: number,
    public name: string,
    public software: EModules,
    public isActive: boolean,
    public features: any[]
  ) {
    super(id, name, software, features);
  }
}
