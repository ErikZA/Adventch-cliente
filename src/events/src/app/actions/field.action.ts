import { FieldModel } from '../models/fields.model'
import { FormGroup } from '@angular/forms';

export const fields: FieldModel[] = [
    { name: "Ola", description: "essa e uma descrição", fieldTypeId: 3, isRequired: false, guidingText: null },
    { name: "Ola", description: "essa e uma descrição", fieldTypeId: 2, isRequired: false, guidingText: null },
];

export const ReadFields = () => ({
    type: "READ_FIELDS",
    payload: {
        status: true,
        data: fields
    }
})

export const AddField = (form: FormGroup, name: string, description: string, guidingText: string, isRequired: boolean, fieldTypeId: number) => {
    fields.push({ name, description, guidingText, isRequired, fieldTypeId })
    form.reset();

    return {
        type: "ADD_FIELD",
        payload: null
    }

}

export const RemoveField = (index: number) => {
    fields.splice(index, 1)

    return {
        type: "REMOVE_FIELD",
        payload: null

    }
}