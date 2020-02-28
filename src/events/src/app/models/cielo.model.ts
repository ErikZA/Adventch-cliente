export class CieloModel {
    constructor(
        public name: string,
        public merchantId: string,
        public merchantKey: string,
    ) { }
}

export class CieloModelReducer {
    public name: string;
    public merchantId: string;
    public merchantKey: string;
}