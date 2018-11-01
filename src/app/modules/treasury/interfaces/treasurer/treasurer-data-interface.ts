import { FunctionTreasurerDataInterface } from './function-treasurer-data-interface';
import { PhoneTreasurerDataInterface } from './phone-treasurer-data-interface';

export interface TreasurerDataInterface {
  id: number;
  name: string;
  address: string;
  addressComplement: string;
  cep: string;
  contact: string;
  email: string;
  churchName: string;
  dateRegister: Date;
  dateLastEdition: Date;
  function: FunctionTreasurerDataInterface;
  phones: PhoneTreasurerDataInterface[];
  districtId: number;
  analystId: number;
}
