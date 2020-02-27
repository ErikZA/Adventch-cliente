import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { FormGroup } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';

import { environment } from '../../../../environments/environment';
import { ReadFields } from 'src/app/actions/field.action';
import { FieldFormComponent } from './field-form/field-form.component';

@Injectable({
  providedIn: 'root'
})
export class FieldsService {

  public uri = environment.eventsApiUrl;

  constructor(
    private http: HttpClient,
    private store: Store<any>,
    private snackBar: MatSnackBar
  ) { }

  One(id: string) {
    return this.http.get(`${this.uri}/Fields/${id}?Id=${id}`)
  }

  All() {
    this.http.get(`${this.uri}/Fields`).subscribe((res: any) => {
      this.store.dispatch(ReadFields(res.data))
    })
  }

  Create(dialog: MatDialogRef<FieldFormComponent>, form: FormGroup, name: string, description: string, guidingText: string, isRequired: boolean, fieldTypeId: number, fieldListId: string) {
    this.http.post(`${this.uri}/Fields`, JSON.stringify({ name, description, guidingText, isRequired, fieldTypeId, fieldListId })).subscribe((res: any) => {
      this.All();
      this.snackBar.open("Campo adicional criado", "Fechar", { duration: 2000 })
      form.reset();
      dialog.close();
    })
  }

  Update(dialog: MatDialogRef<FieldFormComponent>, form: FormGroup, id: string, name: string, description: string, guidingText: string, isRequired: boolean, fieldTypeId: number, fieldListId: string) {
    this.http.put(`${this.uri}/Fields/${id}?Id=${id}`, JSON.stringify({ id, name, description, guidingText, isRequired, fieldTypeId, fieldListId })).subscribe((res: any) => {
      this.All();
      this.snackBar.open("Campo adicional atualizado", "Fechar", { duration: 2000 })
      form.reset();
      dialog.close();
    })
  }

  Remove(id: string) {
    this.http.delete(`${this.uri}/Fields/${id}?Id=${id}`).subscribe((res: any) => {
      this.All();
      this.snackBar.open("Campo adicional removido", "Fechar", { duration: 2000 })
    })
  }

}
