import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  public title: string;
  public message: string;
  public buttonCancel = 'CANCELAR';
  public buttonOk = 'OK';

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

}
