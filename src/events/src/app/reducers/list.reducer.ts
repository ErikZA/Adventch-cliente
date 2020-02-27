import { ActionModel } from '../models/action.model';
import { ListModelReducer } from '../models/list.model';

export const list = new ListModelReducer();

export function ListReducer(state = list, action: ActionModel) {

    switch (action.type) {
        case "READ_LIST":
            return action.payload
        default:
            return state;
    }

}