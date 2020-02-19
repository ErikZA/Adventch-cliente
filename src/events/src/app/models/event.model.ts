export class EventModel {
    public name: string;
    public subscriptionLimit: number;
    public description: string;
    public address: Address;
    public realizationDate: Date;
    public registrationDate: Date;
    public coupons: Coupons[];
    public products: Products[];
    public cashValue: string;
    public installmentAmount: string;
    public installmentLimit: number;
    public bankAccountId: string;
    public paymentType: string;
}

export class EventResponseModel {
    constructor(
        public name: string,
        public description: string,
        public subscriptionLimit: number,
        public realizationDate: Date,
        public registrationDate: Date,
        public cashValue: string,
        public installmentAmount: string,
        public installmentLimit: number,
        public bankAccountId: string,
        public paymentType: string,
        public address: Address,
        public coupons: Coupons[],
        public products: Products[],
    ) { }
}

export class Address {
    constructor(
        public cep: number,
        public street: string,
        public neighborhood: string,
        public city: string,
        public state: string,
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
        public id: number,
        public name: string,
        public account: number,
        public agency: number,
        public bank: string,
        public type: number,
    ) { }
}