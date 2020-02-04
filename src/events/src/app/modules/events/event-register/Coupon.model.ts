export default class CouponModel {
    constructor(
        public name: string,
        public percentage: number,
        public usageLimit: number
    ) { }
}
export class CouponReducer {
    public coupons: CouponModel[] = [{ name: "Test", percentage: 40, usageLimit: 10 }];
};