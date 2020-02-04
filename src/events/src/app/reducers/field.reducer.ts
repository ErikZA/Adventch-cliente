import { ActionModel } from '../models/action.model';

export function fieldReducer(state, action: ActionModel) {

    switch (action.type) {
        case "READ_FIELDS":
            return action.payload;
        case "ADD_FIELD":
            return action.payload;
        case "REMOVE_FIELD":
            return action.payload;
        default:
            return state;
    }

}