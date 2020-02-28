import { List } from '../models/list.model';

export const ReadList = (list: List[]) => ({
    type: "READ_LIST",
    payload: list
})