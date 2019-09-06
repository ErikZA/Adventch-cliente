import { FunctionTreasurerDataInterface } from './function-treasurer-data-interface';
import { PhoneTreasurerDataInterface } from './phone-treasurer-data-interface';
import { ChurchTreasurerDataInterface } from './church-treasurer-data-interface';

export interface TreasurerDataInterface {
  id: number;
  name: string;
  address: string;
  addressComplement: string;
  cep: string;
  contact: string;
  email: string;
  church: ChurchTreasurerDataInterface;
  dateRegister: Date;
  dateLastEdition: Date;
  function: FunctionTreasurerDataInterface;
  phones: PhoneTreasurerDataInterface[];
  districtId: number;
  analystId: number;
}
