export class EventModel {
    public name: string;
    public numberSubscriptions: number;
    public description: string;
    public adrees: Address;
    public realizationDate: Date;
    public coupons: Coupons[];
    public products: Products[];
    public cashValue: string;
    public installmentAmount: string;
    public installmentLimit: number;
    public receiptAccountId: string;
}

export class EventResponseModel {
    constructor(
        public name: string,
        public numberSubscriptions: number,
        public description: string,
        public adrees: Address,
        public realizationDate: Date,
        public coupons: Coupons[],
        public cashValue: string,
        public installmentAmount: string,
        public installmentLimit: number,
        public receiptAccountId: string,
    ) { }
}

export class Address {
    constructor(
        public cep: number,
        public street: string,
        public neighborhood: string,
        public city: string,
        public uf: string,
        public complement: string,
        public number: number,
    ) { }
}

class Date {
    constructor(
        public begin: string,
        public end: string,
    ) { }
}

export class Coupons {
    constructor(
        public name: string,
        public percentage: number,
        public usageLimit: number,
    ) { }
}

export class Products {
    constructor(
        public name: string,
        public value: number,
    ) { }
}

export class ProductsReducer {
    public name: string;
    public value: number;
}

export class Payment {
    constructor(
        public name: string,
        public account: number,
        public agency: number,
        public bank: string,
    ) { }
}