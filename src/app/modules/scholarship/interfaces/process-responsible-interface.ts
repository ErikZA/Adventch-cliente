import { StatusProcessInterface } from './status-process-interface';
export interface ProcessResponsibleInterface {
  protocol: string;
  nameStudent: string;
  status: StatusProcessInterface;
  pendency: string;
  motiveReject: string;
  isSendDocument: boolean;
  dateRegistration: Date;
}
