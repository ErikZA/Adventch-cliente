import { Products } from '../models/event.model'

import { coupons } from '../actions/coupon.action';
import { produts } from '../actions/products.action';
import CouponModel from '../modules/events/event-register/Coupon.model';

export const AddInformation = (name: string, description: string, subscriptionLimit: number, realizationDate: string, registrationDate: string) => {
  return {
    type: "ADD_INFORMATION",
    payload: {
      name,
      description,
      subscriptionLimit,
      realizationDate,
      registrationDate
    }
  }
}

export const AddCoupon = (coupons: CouponModel[]) => {
  return {
    type: "ADD_COUPON",
    payload: coupons
  }
}

export const AddAdress = (
  cep: number,
  street: string,
  neighborhood: string,
  city: string,
  uf: string,
  complement: string,
  number: number,
) => {
  return {
    type: "ADD_ADRESS",
    payload: { cep, street, neighborhood, city, uf, complement, number }
  }
}

export const AddPayments = (cashValue: number, installmentAmount: number, installmentLimit: number, receiptAccountId: string) => {
  return {
    type: "ADD_PAYMENTS",
    payload: {
      cashValue,
      installmentAmount,
      installmentLimit,
      receiptAccountId
    }
  }
}

export const AddProducts = (products: Products[]) => {
  return {
    type: "ADD_PRODUCTS",
    payload: {
      products
    }
  }
}

export const RegisterEvent = () => {

  coupons.splice(0, coupons.length);
  produts.splice(0, produts.length);

  return {
    type: "REGISTER_EVENT",
    payload: null
  }
}
