import { Injectable } from '@angular/core';

import { Observable ,  BehaviorSubject } from 'rxjs';


import { Unit } from './models/unit.model';
import { SharedService } from './shared.service';
import { EModules } from './models/modules.enum';
import { User } from './models/user.model';
import { auth } from '../auth/auth';

@Injectable()
export class SharedStore {

  units$: Observable<Unit[]>;
  private _units: BehaviorSubject<Unit[]>;
  private dataStore: {
    units: Unit[],
    user: User
  };

  constructor(
    private service: SharedService
  ) {
    this.dataStore = {
      units: [],
      user: null
    };
    this._units = <BehaviorSubject<Unit[]>>new BehaviorSubject([]);
    this.units$ = this._units.asObservable();
  }

  public loadAllUnits(): void {
    const { id } = auth.getCurrentUser();
    this.service.getUnits(id).subscribe((data: Unit[]) => {
      this.dataStore.units = data;
      this._units.next(Object.assign({}, this.dataStore).units);
    }, err => console.log('Could not load todos roles.'));
  }
}
