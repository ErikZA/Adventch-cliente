import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import 'rxjs/add/observable/of';

import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';

@Injectable()
export class RequirementStore {

  constructor(
    private service: TreasuryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

}
