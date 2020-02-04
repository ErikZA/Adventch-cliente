import { ActionModel } from '../models/action.model';
import { AuthModel } from '../models/auth.model';

export const auth = new AuthModel();

export function authReducer(state = auth, action: ActionModel) {

    switch (action.type) {
        case "IS_AUTH":
            return action.payload;
        default:
            return state;
    }

}