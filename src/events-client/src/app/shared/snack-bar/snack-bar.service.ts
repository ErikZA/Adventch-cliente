import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { SnackBarComponent } from './snack-bar.component';

@Injectable()
export class SnackBarService {

  constructor(public snackBar: MatSnackBar) { }

  open(icon: string, msg: string, duration: number, type: string) {

    this.snackBar.openFromComponent(SnackBarComponent, {
      data: { msg, icon },
      duration,
      panelClass: [type]
    })

  }

}
