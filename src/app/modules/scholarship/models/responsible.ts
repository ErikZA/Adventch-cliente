import { Student } from './student';

export class Responsible {
  id: number;
  name: string;
  cpf?: string;
  email?: string;
  phone?: string;
  password?: string;
  token?: string;
  students?: Student[];
  constructor() { }
}
