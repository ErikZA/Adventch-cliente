export class FieldModel {
    constructor(
        public name: string,
        public description: string,
        public guidingText: string,
        public isRequired: boolean,
        public fieldTypeId: number,
    ) {
    }
}