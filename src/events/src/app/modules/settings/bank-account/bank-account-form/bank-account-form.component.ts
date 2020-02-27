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

  public id: string;
  public isEdit = false;

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

    if (this.data !== undefined && this.data !== null) {
      this.id = this.data.id;
      this.bank.One(this.data.id).then((res: any) => {
        this.isEdit = true;
        const { name, bankId, agency, accountNumber, agreementNumber } = res.data[0];
        this.formBankAccount.controls["name"].setValue(name);
        this.formBankAccount.controls["agency"].setValue(agency);
        this.formBankAccount.controls["bankId"].setValue(bankId);
        this.formBankAccount.controls["accountNumber"].setValue(accountNumber);
        this.formBankAccount.controls["agreementNumber"].setValue(agreementNumber);
      })

    }

  }

  createBankAccount() {
    const { name, bankId, agency, accountNumber, agreementNumber } = this.formBankAccount.value;
    this.bank.Crate(this.dialogRef, this.formBankAccount, name, bankId, agency, accountNumber, agreementNumber);
  }

  UpdateBankAccount() {
    const { name, bankId, agency, accountNumber, agreementNumber } = this.formBankAccount.value;
    this.bank.Update(this.dialogRef, this.formBankAccount, this.id, name, bankId, agency, accountNumber, agreementNumber);
  }

}
