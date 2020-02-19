import { ActionModel } from '../models/action.model';
import { FieldModelReducer } from '../models/fields.model';

const field = new FieldModelReducer();

export function fieldReducer(state = field, action: ActionModel) {

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