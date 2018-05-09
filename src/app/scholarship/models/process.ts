import { Student } from './student';
import { EStatus } from './enums';

export class Process {
  id: number;
  identity: string;
  student: Student;
  protocol: string;
  isPersonalDocuments: boolean = false;
  isIR: boolean = false;
  isCTPS: boolean = false;
  isIncome: boolean = false;
  isExpenses: boolean = false;
  isAcademic: boolean = false;
  status: EStatus;
  statusString: string;
  pendency: string;
  dateRegistration?: Date;
  constructor() { }
}
