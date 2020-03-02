import { ActionModel } from '../models/action.model';

export function SidebarReducer(state = { open: true, action: "side" }, action: ActionModel) {

    switch (action.type) {
        case "SIDEBAR":
            return action.payload;
        default:
            return state;
    }

}