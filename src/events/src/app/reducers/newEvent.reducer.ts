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
            state = new EventModel();
            return state;
        default:
            return state;
    }

}