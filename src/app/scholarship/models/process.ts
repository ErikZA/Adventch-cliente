import { Student } from './student';
import { EStatus } from './enums';
import { ProcessDocument } from './processDocument';

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
  motiveReject: string;
  processDocuments: Array<ProcessDocument>;
  bagPorcentage: Number;
  constructor() { }
}
