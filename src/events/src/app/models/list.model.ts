export class List {
    constructor(
        public name: string,
        public description: string,
        public items: ListItem[]
    ) {
    }
}

export class ListItem {
    constructor(
        public description: string,
    ) {
    }
}

export class ListModelReducer {
    public name: string;
    public description: string;
    public items: ListItem[];
}