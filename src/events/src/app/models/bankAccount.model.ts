export class BankAccountModel {
    public id: string;
    public name: string;
    public agency: string;
    public account: string;
}

export class BankAccount {
    constructor(
        public id: string,
        public name: string,
        public agency: string,
        public account: string,
    ) { }
}