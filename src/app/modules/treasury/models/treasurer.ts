import { EGender, EFunction } from './Enums';
import { Unit } from '../../../shared/models/unit.model';
import { Church } from './church';
import { Phone } from './phone';

export class Treasurer {
  id: number;
  identity: string;
  unit: Unit;
  church: Church;
  name: string;
  function: EFunction;
  functionName: string; // não mapeado
  gender?: EGender;
  dateRegister?: Date;
  dateRegisterFormatted: string; // não mapeado
  contact?: string;
  address?: string;
  addressComplement?: string;
  cep?: string;
  phones?: Array<Phone>;
  email?: string;
  dateBirth?: Date;
  cpf?: string;
  dateLastEdition?: Date;
  constructor(
  ) { }

  getFunction() {
    if (this.function === 1) {
      return 'Tesoureiro (a)';
    }
    if (this.function === 2) {
      return 'Tesoureiro (a) Associado (a)';
    }
    return 'Tesoureiro (a) Assistente';
  }
}

