import { ActionModel } from '../models/action.model';
import { UserModel } from '../models/user.model';

export const user = new UserModel();

export function UserReducer(state = user, action: ActionModel) {

    switch (action.type) {
        case "USER_READ":
            return action.payload
        default:
            return state;
    }

}