import { ActionModel } from '../models/action.model';
import { EventModel } from '../models/event.model';

export const event = new EventModel();

export function SubscriptionReducer(state = event, action: ActionModel) {

    switch (action.type) {
        case "SUBSCRIPTION":
            return action.payload
        default:
            return state;
    }

}