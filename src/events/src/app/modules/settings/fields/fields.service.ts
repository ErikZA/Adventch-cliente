import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { ReadFields } from 'src/app/actions/field.action';
import { MatSnackBar } from '@angular/material';
import { FormGroup } from '@angular/forms';

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

  Create(form: FormGroup, name: string, description: string, guidingText: string, isRequired: boolean, fieldTypeId: number) {
    this.http.post(`${this.uri}/Fields`, JSON.stringify({ name, description, guidingText, isRequired, fieldTypeId })).subscribe((res: any) => {
      this.All();
      this.snackBar.open("Campo adicional criado", "Fechar", { duration: 2000 })
      form.reset();
    })
  }

  Update(form: FormGroup, id: string, name: string, description: string, guidingText: string, isRequired: boolean, fieldTypeId: number) {
    this.http.put(`${this.uri}/Fields/${id}?Id=${id}`, JSON.stringify({ id, name, description, guidingText, isRequired, fieldTypeId })).subscribe((res: any) => {
      this.All();
      this.snackBar.open("Campo adicional atualizado", "Fechar", { duration: 2000 })
      form.reset();
    })
  }

  Remove(id: string) {
    this.http.delete(`${this.uri}/Fields/${id}?Id=${id}`).subscribe((res: any) => {
      this.All();
      this.snackBar.open("Campo adicional removido", "Fechar", { duration: 2000 })
    })
  }

}
