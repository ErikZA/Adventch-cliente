import { Permission } from "./permission.model";

export class User {
  id: number;
  identifier: string;
  name: string;
  firstName: string;
  email: string;
  isSysAdmin: number;
  isScholarship: boolean;
  idSchool: number;
  permissions: Permission[]

  constructor() { }
}
