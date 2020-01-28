import { ActionTypes } from '../models/action.enum';
import { ActionModel } from '../models/action.model';
import { CouponReducer } from '../modules/subscriptions/subscription/Coupon.model';

export const coupon = new CouponReducer();

export function couponReducer(state = coupon, action: ActionModel) {

    switch (action.type) {
        case ActionTypes.Read:
            return action.payload
        case ActionTypes.Add:
            return action.payload;
        default:
            return state;
    }

}