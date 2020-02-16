import { loginEnum } from '../action/auth.action';
import { ActionModel } from '../models/action.model';
import { AuthModel } from '../models/auth.model';

const auth = new AuthModel();

export function AuthReducer(state = auth, action: ActionModel) {

    switch (action.type) {
        case loginEnum.LOGIN:
            return action.payload;
        default:
            return state;
    }

}