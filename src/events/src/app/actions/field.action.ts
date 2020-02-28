import { FieldModel } from '../models/fields.model'
import { FormGroup } from '@angular/forms';

export const ReadFields = (fields: FieldModel[]) => ({
    type: "READ_FIELDS",
    payload: {
        status: true,
        data: fields
    }
})

export const AddField = (form: FormGroup) => {
    form.reset();

    return {
        type: "ADD_FIELD",
        payload: null
    }

}

export const RemoveField = () => ({
    type: "REMOVE_FIELD",
    payload: null
})