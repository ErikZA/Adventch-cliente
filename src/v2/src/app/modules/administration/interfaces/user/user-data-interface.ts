import { ProfileUserDataInterface } from './profile-user-data-interface';

export interface UserDataInterface {
    id: number;
    name: string;
    email: string;
    birthday: Date;
    profiles: ProfileUserDataInterface[];
}
