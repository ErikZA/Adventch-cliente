import { Student } from './student';
import { EStatus } from './enums';
import { ProcessDocument } from './processDocument';
export class Process {
  id: number;
  identity: string;
  student: Student;
  protocol: string;
  isPersonalDocuments = false;
  isIR = false;
  isCTPS = false;
  isIncome = false;
  isExpenses = false;
  isAcademic = false;
  status: EStatus;
  statusString: string;
  pendency: string;
  dateRegistration?: Date;
  isSendDocument = false;
  motiveReject: string;
  processDocuments: Array<ProcessDocument>;
  bagPorcentage: Number;
  constructor() { }
}
