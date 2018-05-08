import { Student } from './student';

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
  // status: Status;
  constructor() { }
}
