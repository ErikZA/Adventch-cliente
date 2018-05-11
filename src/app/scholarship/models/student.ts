import { Responsible } from "./responsible";
import { School } from "./school";

export class Student {
  id: number;
  rc?: string;
  name: string;
  responsible: Responsible;
  school: School;
  constructor() { }
}
