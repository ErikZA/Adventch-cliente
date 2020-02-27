import { Component, OnInit } from '@angular/core';
import { BankAccountService } from './bank-account.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { BankAccount } from 'src/app/models/bankAccount.model';
import { MatDialog } from '@angular/material';
import { BankAccountFormComponent } from './bank-account-form/bank-account-form.component';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {

  public bankAccount$: Observable<any>;
  public bankAccounts: BankAccount[] = [];

  constructor(
    public bank: BankAccountService,
    private store: Store<any>,
    private dialog: MatDialog
  ) {
    this.bankAccount$ = store.select('bankAccount')
  }

  ngOnInit() {
    this.bank.All();
    this.bankAccount$.subscribe(res => this.bankAccounts = res);
  }

  OpenFormBankAccount() {
    this.dialog.open(BankAccountFormComponent, {
      width: '300',
    })
  }

  UpdateOpenFormBankAccount(id: string) {
    this.dialog.open(BankAccountFormComponent, {
      width: '300',
      data: { id }
    })
  }

  RemoveBankAccount(id: string) {
    this.bank.Remove(id)
  }

}
