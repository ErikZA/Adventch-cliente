import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BankAccountService } from '../bank-account.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-bank-account-form',
  templateUrl: './bank-account-form.component.html',
  styleUrls: ['./bank-account-form.component.scss']
})
export class BankAccountFormComponent implements OnInit {

  public formBankAccount: FormGroup;
  public banks: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<BankAccountFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public fb: FormBuilder,
    public bank: BankAccountService,
  ) { }

  ngOnInit() {
    this.formBankAccount = this.fb.group({
      name: ['', [Validators.required]],
      bankId: ['', [Validators.required]],
      agency: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      agreementNumber: ['', [Validators.required]],
    })
    this.bank.GetBank().subscribe((res: any) => this.banks = res.data);
  }

  createBankAccount() {
    const { name, bankId, agency, accountNumber, agreementNumber } = this.formBankAccount.value;
    this.bank.Crate(this.dialogRef, this.formBankAccount, name, bankId, agency, accountNumber, agreementNumber);
  }

}
