import { BankAccount } from '../models/bankAccount.model';

export const ReadBankAccount = (bankAccounts: BankAccount[]) => ({
    type: "READ_BANK_ACCOUNT",
    payload: bankAccounts
})