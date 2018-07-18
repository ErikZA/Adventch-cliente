import { Church } from "./church";
import { User } from "../../../shared/models/user.model";
import { EObservationStatus } from "./Enums";

export class Observation {
  id: number;
  description: string;
  date: Date;
  church: Church;
  responsible: User;
  status: EObservationStatus;

  constructor() { }
}

