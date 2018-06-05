import { Injectable } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';

import { Observable } from 'rxjs/Rx';

import { LockScreenComponent } from './lock-screen.component';

@Injectable()
export class LockScreenService {

  constructor(
    private dialog: MatDialog
  ) { }

  public lockScreen(userName: string, userPhotoUrl: string): Observable<boolean> {

    let dialogRef: MatDialogRef<LockScreenComponent>;

    dialogRef = this.dialog.open(LockScreenComponent, {
      disableClose: true,
      backdropClass: 'lock-screen-container'
    });
    dialogRef.componentInstance.userName = userName;
    dialogRef.componentInstance.userPhotoUrl = userPhotoUrl;

    return dialogRef.afterClosed();
  }
}
