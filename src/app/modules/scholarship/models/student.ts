import { Responsible } from "./responsible";
import { School } from "./school";
import { StudentSerie } from "./studentSerie";

export class Student {
  id: number;
  rc?: string;
  name: string;
  responsible: Responsible;
  school: School;
  studentSerie: StudentSerie;
  constructor() { }
}
