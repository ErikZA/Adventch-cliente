import { StatusProcessInterface } from './status-process-interface';
import { School } from '../models/school';
export interface ProcessResponsibleInterface {
  protocol: string;
  nameStudent: string;
  status: StatusProcessInterface;
  pendency: string;
  motiveReject: string;
  isSendDocument: boolean;
  dateRegistration: Date;
  school: School;
}
