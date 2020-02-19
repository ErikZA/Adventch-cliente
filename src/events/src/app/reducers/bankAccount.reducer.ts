import { ActionModel } from '../models/action.model';
import { BankAccountModel } from '../models/bankAccount.model';

const bankAccounts: BankAccountModel[] = [];

export function BankAccountReducer(state = bankAccounts, action: ActionModel) {

    switch (action.type) {
        case "READ_BANK_ACCOUNT":
            return action.payload
        default:
            return state;
    }

}