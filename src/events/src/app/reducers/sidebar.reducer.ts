import { ActionModel } from '../models/action.model';

export function SidebarReducer(state = { open: false, action: "side" }, action: ActionModel) {

    switch (action.type) {
        case "SIDEBAR":
            return action.payload;
        default:
            return state;
    }

}