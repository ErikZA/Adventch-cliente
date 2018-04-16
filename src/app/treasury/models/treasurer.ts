import { EGender, EFunction } from "./Enums";
import { Unit } from "../../shared/models/unit.model";
import { Church } from "./church";

export class Treasurer {
  id: string;
  unit: Unit;
  church: Church;
  name: string;
  function: EFunction;
  gender?: EGender;
  dateRegister?: Date;
  contact?: string;
  address?: string;
  addressComplement?: string;
  cep?: string;
  phone?: string;
  email?: string;
  dateBirth?: Date;
  cpf?: string;
  constructor(
  ) { }
}

