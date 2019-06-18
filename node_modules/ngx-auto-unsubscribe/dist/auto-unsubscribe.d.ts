export declare function AutoUnsubscribe({blackList, includeArrays, arrayName, event}?: {
    blackList?: any[];
    includeArrays?: boolean;
    arrayName?: string;
    event?: string;
}): (constructor: Function) => void;
