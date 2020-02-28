import { ActionModel } from '../models/action.model';
import { EventModel } from '../models/event.model';

const event = new EventModel();

export function eventReducer(state = event, action: ActionModel) {

    switch (action.type) {
        case "READ_EVENTS":
            return action.payload
        default:
            return state;
    }

}