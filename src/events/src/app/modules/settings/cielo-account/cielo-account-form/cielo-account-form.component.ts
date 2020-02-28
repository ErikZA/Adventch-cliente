import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { CieloAccountService } from '../cielo-account.service';

@Component({
  selector: 'app-cielo-account-form',
  templateUrl: './cielo-account-form.component.html',
  styleUrls: ['./cielo-account-form.component.scss']
})
export class CieloAccountFormComponent implements OnInit {

  public id: string;
  public isEdit = false;

  public formCieloAccount: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CieloAccountFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private cielo: CieloAccountService
  ) { }

  ngOnInit() {
    this.formCieloAccount = this.fb.group({
      name: ['', [Validators.required]],
      merchantId: ['', [Validators.required]],
      merchantKey: ['', [Validators.required]],
    })

    if (this.data !== undefined && this.data !== null) {
      this.id = this.data.id
      this.isEdit = true;
      this.cielo.One(this.data.id).then((res: any) => {
        const { name, merchantId, merchantKey } = res.data[0];
        this.formCieloAccount.controls["name"].setValue(name)
        this.formCieloAccount.controls["merchantId"].setValue(merchantId)
        this.formCieloAccount.controls["merchantKey"].setValue(merchantKey)
      })
    }

  }

  Create() {
    const { name, merchantId, merchantKey } = this.formCieloAccount.value;
    this.cielo.Create(this.dialogRef, this.formCieloAccount, name, merchantId, merchantKey);
  }

  Update() {
    const { name, merchantId, merchantKey } = this.formCieloAccount.value;
    this.cielo.Update(this.dialogRef, this.formCieloAccount, this.id, name, merchantId, merchantKey);
  }

}
