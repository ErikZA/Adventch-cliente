import { ActionModel } from '../models/action.model';

export function LoadingReducer(state = false, action: ActionModel) {

    switch (action.type) {
        case "LOADED":
            return action.payload;
        default:
            return state;
    }
}