import { ActionModel } from '../models/action.model';
import { CieloModelReducer } from '../models/cielo.model';

export const cielo = new CieloModelReducer();

export function CieloAccountReducer(state = cielo, action: ActionModel) {

    switch (action.type) {
        case "READ_CIELO_ACCOUNT":
            return action.payload
        default:
            return state;
    }

}