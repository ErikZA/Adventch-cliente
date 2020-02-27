import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ReadBankAccount } from 'src/app/actions/bankAccount.action';
import { FormGroup } from '@angular/forms';
import { format } from 'url';
import { SnackBarService } from 'src/app/shared/snack-bar/snack-bar.service';
import { MatDialogRef } from '@angular/material';
import { BankAccountFormComponent } from './bank-account-form/bank-account-form.component';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {

  public uri = environment.eventsApiUrl;

  public bankAccount$: Observable<any>;

  constructor(
    private http: HttpClient,
    private store: Store<any>,
    private snakBank: SnackBarService
  ) {
    this.bankAccount$ = store.select('bankAccount')
  }

  GetBank() {
    return this.http.get(`${this.uri}/Bank`);
  }

  GetMethodPayment() {
    return this.http.get(`${this.uri}/PaymentTypes`);
  }

  All() {
    this.http.get(`${this.uri}/BankAccounts`).subscribe((res: any) => {
      this.store.dispatch(ReadBankAccount(res.data));
    })
  }

  Crate(dialog: MatDialogRef<BankAccountFormComponent>, form: FormGroup, name: string, bankId: string, agency: string, accountNumber: string, agreementNumber: string) {
    this.http.post(`${this.uri}/BankAccounts`, JSON.stringify({ name, bankId, agency, accountNumber, agreementNumber })).subscribe((res: any) => {
      form.reset();
      this.All();
      this.snakBank.open("check", "Conta criado com sucesso", 2000, "SUCCESS")
      dialog.close();
    })
  }

  Remove(id: string) {
    this.http.delete(`${this.uri}/BankAccounts/${id}?Id=${id}`).subscribe((res: any) => {
      this.All();
      this.snakBank.open("check", "Conta removido com sucesso", 2000, "SUCCESS")
    })
  }

}
