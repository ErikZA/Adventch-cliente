import { Profile } from '../../modules/administration/models/profile/profile.model';
import { Role } from '../../modules/administration/models/role.model';

export class User {
  id: number;
  identifier: string;
  name: string;
  firstName: string;
  email: string;
  birthday?: Date;
  cpf?: string;
  idDefaultUnit: number;
  isSysAdmin: boolean;
  isScholarship: boolean;
  idSchool: number;
  roles: Role[];
  profiles: Profile[];

  constructor() { }
}
