import { ActionModel } from '../models/action.model';
import { ProductsReducer } from '../models/event.model';

const product = new ProductsReducer();

export function productReducer(state = product, action: ActionModel) {

    switch (action.type) {
        case "READ_PRODCUTS":
            return action.payload
        case "ADD_PRODUCT":
            return action.payload
        case "REMOVE_PRODUCT":
            return action.payload
        default:
            return state;
    }

}