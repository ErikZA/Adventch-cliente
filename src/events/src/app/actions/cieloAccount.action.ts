import { CieloModel } from '../models/cielo.model';

export const ReadCieloAccount = (accounts: CieloModel[]) => ({
    type: "READ_CIELO_ACCOUNT",
    payload: accounts
})