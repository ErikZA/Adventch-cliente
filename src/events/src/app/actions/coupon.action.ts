import { ActionTypes } from '../models/action.enum';
import CouponModel from '../modules/events/event-register/Coupon.model';

import { Action } from '@ngrx/store';

export const coupons: CouponModel[] = [];

export const Read = () => (<Action>{
    type: ActionTypes.Read,
    payload: coupons,
})

export const Add = (name: string, percentage: number, usageLimit: number) => {

    coupons.push({ name, percentage, usageLimit })

    return <Action>{
        type: ActionTypes.Add,
        payload: null
    }
}

export const Remove = (index: number) => {

    coupons.splice(index, 1)

    return <Action>{
        type: ActionTypes.Remove,
        payload: null
    }
}