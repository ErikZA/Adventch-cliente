import { Products } from '../models/event.model'
import { Action } from '@ngrx/store';

export const produts: Products[] = [];

export const ReadProducts = () => (<Action>{
    type: "READ_PRODCUTS",
    payload: produts
})

export const AddProducts = (name: string, value: number) => {

    produts.push({ name, value })

    return <Action>{
        type: "ADD_PRODUCT",
        payload: null
    }
}

export const RemoveProcuts = (index: number) => {

    produts.splice(index, 1)

    return <Action>{
        type: "REMOVE_PRODUCT",
        payload: null
    }
}