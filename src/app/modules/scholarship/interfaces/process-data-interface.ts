import { StatusProcessInterface } from './status-process-interface';
import { DocumentProcessDataInterface } from './document-process-data-interface';
import { StudentProcessDataInterface } from './student-process-data-interface';
import { ResponsibleDataInterface } from './responsible-data-interface';
export interface ProcessDataInterface {
  id: number;
  protocol: string;
  status: StatusProcessInterface;
  student: StudentProcessDataInterface;
  responsible: ResponsibleDataInterface;
  bagPorcentage: number;
  serie: string;
  school: string;
  pendency: string;
  motiveReject: string;
  isSendDocument: boolean;
  dateRegistration: Date;
  documents: DocumentProcessDataInterface[];
  hasUploads: boolean;
}
