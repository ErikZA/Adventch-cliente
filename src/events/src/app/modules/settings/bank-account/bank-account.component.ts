import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccountService } from './bank-account.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { BankAccount } from 'src/app/models/bankAccount.model';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.scss']
})
export class BankAccountComponent implements OnInit {

  public formBankAccount: FormGroup;

  public bankAccount$: Observable<any>;
  public bankAccounts: BankAccount[] = [];

  public banks: any[] = [];

  constructor(
    public fb: FormBuilder,
    public bank: BankAccountService,
    private store: Store<any>,
  ) {
    this.bankAccount$ = store.select('bankAccount')
  }

  ngOnInit() {

    this.formBankAccount = this.fb.group({
      name: ['', [Validators.required]],
      bankId: ['', [Validators.required]],
      agency: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      agreementNumber: ['', [Validators.required]],
    })

    this.bank.All();
    this.bank.GetBank().subscribe((res: any) => this.banks = res.data);
    this.bankAccount$.subscribe(res => this.bankAccounts = res);

  }

  createBankAccount() {
    const { name, bankId, agency, accountNumber, agreementNumber } = this.formBankAccount.value;
    this.bank.Crate(this.formBankAccount, name, bankId, agency, accountNumber, agreementNumber);
  }

}
