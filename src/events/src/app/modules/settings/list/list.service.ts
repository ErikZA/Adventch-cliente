import { Injectable } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { ListFormComponent } from './list-form/list-form.component';
import { environment } from 'src/environments/environment';
import { Store } from '@ngrx/store';
import { ReadList } from 'src/app/actions/list.action';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  public uri = environment.eventsApiUrl;

  constructor(
    public http: HttpClient,
    public snackBar: MatSnackBar,
    private store: Store<any>,
  ) { }

  async One(id: string) {
    return await this.http.get(`${this.uri}/Lists/${id}?IdList=${id}`).toPromise();
  }

  All() {
    this.http.get(`${this.uri}/Lists`).subscribe((res: any) => {
      this.store.dispatch(ReadList(res.data));
    })
  }

  Create(dialog: MatDialogRef<ListFormComponent>, name: string, description: string, items: any) {
    this.http.post(`${this.uri}/Lists`, JSON.stringify({ name, description, items })).subscribe((res) => {
      this.All();
      dialog.close();
      this.snackBar.open("Lista criada com sucesso", "Fechar", { duration: 3000 })
    })
  }

  Update(dialog: MatDialogRef<ListFormComponent>, id: string, name: string, description: string, items: any) {
    this.http.put(`${this.uri}/Lists/${id}?Id=${id}`, JSON.stringify({ id, name, description, items })).subscribe((res) => {
      this.All();
      dialog.close();
      this.snackBar.open("Lista atualizada com sucesso", "Fechar", { duration: 3000 })
    })
  }

  Remove(id: string) {
    this.http.delete(`${this.uri}/Lists/${id}?Id=${id}`).subscribe((res) => {
      this.All();
      this.snackBar.open("Lista removida com sucesso", "Fechar", { duration: 3000 })
    })
  }

}
