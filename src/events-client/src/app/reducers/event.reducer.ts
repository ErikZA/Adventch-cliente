import { ActionModel } from '../models/action.model';

export function eventReducer(state, action: ActionModel) {

    switch (action.type) {
        case "READ_EVENTS":
            const events = JSON.parse(localStorage.getItem("events"));
            return events
        default:
            return state;
    }

}