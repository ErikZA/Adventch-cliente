import { ActionModel } from '../models/action.model';
import { EventModel } from '../models/event.model';

const event = new EventModel();

export function newEvent(state = event, action: ActionModel) {

    switch (action.type) {
        case "ADD_INFORMATION":
            state = { ...action.payload }
            return state
        case "ADD_COUPON":
            state.coupons = { ...action.payload }
            return state
        case "ADD_ADRESS":
            state.adrees = { ...action.payload }
            return state;
        case "ADD_PAYMENTS":
            const { cashValue, installmentAmount, installmentLimit, receiptAccountId } = action.payload;
            state.cashValue = cashValue
            state.installmentAmount = installmentAmount
            state.installmentLimit = installmentLimit
            state.receiptAccountId = receiptAccountId
            return state;
        case "ADD_PRODUCTS":
            state.products = { ...action.payload }
            return state;
        case "REGISTER_EVENT":
            const events = JSON.parse(localStorage.getItem("events"));
            if (events === null) {
                localStorage.setItem("events", JSON.stringify([state]))
            } else {
                events.push(state)
                localStorage.setItem("events", JSON.stringify(events))
            }
            state = new EventModel();
            return state;
        default:
            return state;
    }

}