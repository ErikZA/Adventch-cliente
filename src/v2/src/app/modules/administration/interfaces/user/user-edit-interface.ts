import { ProfileUserEditInterface } from './profile-user-edit-interface';

export interface UserEditInterface {
  id: number;
  name: string;
  email: string;
  birthday: Date;
  isAdmin: boolean;
  idSchool: number;
  profiles: ProfileUserEditInterface[];
}
