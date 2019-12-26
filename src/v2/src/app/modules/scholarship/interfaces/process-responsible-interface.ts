import { StatusProcessInterface } from './status-process-interface';
import { School } from '../models/school';
export interface ProcessResponsibleInterface {
  id: number;
  protocol: string;
  nameStudent: string;
  status: StatusProcessInterface;
  pendency: string;
  motiveReject: string;
  isSendDocument: boolean;
  dateRegistration: Date;
  dateCreation: Date;
  school: School;
  hasUploads: boolean;
  schoolYear: number;
}
