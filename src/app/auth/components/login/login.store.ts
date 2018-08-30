import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../auth.service';
import { auth } from '../../auth';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class LoginStore {

  constructor(
    private service: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  public logoff(): void {
    this.router.navigate(['/login']);
    auth.logoffMain();
  }

  public logoffResponsible(): void {
    this.router.navigate(['/educacao']);
    auth.logoffResponsible();
  }
}
