import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { Church } from '../../models/church';
import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';

@Injectable()
export class ChurchStore {

  churches$: Observable<Church[]>;
  private _churches: BehaviorSubject<Church[]>;
  private dataStore: {
    churches: Church[]
  };
  public church: Church;

  constructor(
    private service: TreasuryService,
    private authService: AuthService
  ) {
    this.dataStore = {
      churches: []
    };
    this._churches = <BehaviorSubject<Church[]>>new BehaviorSubject([]);
    this.churches$ = this._churches.asObservable();

    this.church = new Church();
  }

}
