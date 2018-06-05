import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Rx';

import { ConfirmDialogComponent } from './confirm-dialog.component';

@Injectable()
export class ConfirmDialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  public confirm(title: string, message: string, confirmButtonText?: string, cancelButtonText?: string): Observable<boolean> {

    let dialogRef: MatDialogRef<ConfirmDialogComponent>;

    dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.title = title;
    dialogRef.componentInstance.message = message;
    if (confirmButtonText)
      dialogRef.componentInstance.buttonOk = confirmButtonText;
    if (cancelButtonText)
      dialogRef.componentInstance.buttonCancel = cancelButtonText;

    return dialogRef.afterClosed();
  }

  public confirmRemove(): Observable<boolean> {

    let dialogRef: MatDialogRef<ConfirmDialogComponent>;

    dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.componentInstance.title = 'Remover esse registro?';
    dialogRef.componentInstance.message = 'Esse registro será removido e não aparecerá mais na listagem.';
    dialogRef.componentInstance.buttonOk = 'REMOVER';

    return dialogRef.afterClosed();
  }

}
