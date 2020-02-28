import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import { CieloAccountFormComponent } from './cielo-account-form/cielo-account-form.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { ReadCieloAccount } from 'src/app/actions/cieloAccount.action';

@Injectable({
  providedIn: 'root'
})
export class CieloAccountService {

  public cielo$: Observable<any>;
  public uri = environment.eventsApiUrl;

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private store: Store<any>,
  ) {
  }

  One(id: string) {
    return this.http.get(`${this.uri}/CieloAccounts/${id}?CieloAccountsId=${id}`).toPromise();
  }

  All() {
    this.http.get(`${this.uri}/CieloAccounts`).subscribe((res: any) => this.store.dispatch(ReadCieloAccount(res.data)))
  }

  Create(dialog: MatDialogRef<CieloAccountFormComponent>, form: FormGroup, name: string, merchantId: string, merchantKey: string) {
    this.http.post(`${this.uri}/CieloAccounts`, JSON.stringify({ name, merchantId, merchantKey })).subscribe((res: any) => {
      this.All();
      form.reset();
      dialog.close();
      this.snackbar.open("Conta criado com sucesso", "Fechar", { duration: 2000 })
    })
  }

  Update(dialog: MatDialogRef<CieloAccountFormComponent>, form: FormGroup, id: string, name: string, merchantId: string, merchantKey: string) {
    this.http.put(`${this.uri}/CieloAccounts/${id}`, JSON.stringify({ id, name, merchantId, merchantKey })).subscribe((res: any) => {
      this.All();
      form.reset();
      dialog.close();
      this.snackbar.open("Conta atualizado com sucesso", "Fechar", { duration: 2000 })
    })
  }

  Delete(id: string) {
    this.http.delete(`${this.uri}/CieloAccounts/${id}`).subscribe((res: any) => {
      this.All();
      this.snackbar.open("Conta removido com sucesso", "Fechar", { duration: 2000 })
    })
  }

}
