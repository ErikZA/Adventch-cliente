import { ProcessDocument } from './processDocument';
import { EStatus } from './enums';
import { Student } from './student';
import { School } from './school';
export class Process {
  id: number;
  // identity: string;
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
  dateCreation?: Date;
  isSendDocument = false;
  motiveReject: string;
  processDocuments: Array<ProcessDocument>;
  bagPorcentage: Number;
  idSchool: number;
  constructor() { }
}
