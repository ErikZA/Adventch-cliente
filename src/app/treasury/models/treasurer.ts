import { EGender } from "./Enums";

export class EFunction {
  id: string;
  function: EFunction;
  gender?: EGender;  
  name: string;
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

