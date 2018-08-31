import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import { Districts } from '../../models/districts';
import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';

import * as moment from 'moment';
import { User } from '../../../../shared/models/user.model';
import { auth } from '../../../../auth/auth';

@Injectable()
export class DistrictsStore {
  districts$: Observable<Districts[]>;
  private _districts: BehaviorSubject<Districts[]>;
  users: User[] = null;
  private dataStore: {
    districts: Districts[]
  };
  public districts: Districts;
  constructor(
    private service: TreasuryService,
    private authService: AuthService
  ) {
    this.dataStore = {
      districts: []
    };
    this._districts = <BehaviorSubject<Districts[]>>new BehaviorSubject([]);
    this.districts$ = this._districts.asObservable();
  }

  /* Listagem */
  public loadAll(): void {
    const unit = auth.getCurrentUnit();
    this.service.getDistricts(unit.id).subscribe((data: Districts[]) => {
      this.dataStore.districts = data;
      this._districts.next(Object.assign({}, this.dataStore).districts);
    });
  }

  /* Abrir sidenav*/
  openDistrict(district) {
    this.districts = district;
  }

  /*Search*/
  public search(search: string): Districts[] {
    if (search === '' || search === undefined || search === null) {
      return this.dataStore.districts;
    } else {
      return this.dataStore.districts.filter(data => {
        return data.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          || data.analyst.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
      });
    }
  }

  /* Remoção */
  public remove(id) {
    this.service.removeDistricts(id).subscribe(() => {
      const index = this.dataStore.districts.findIndex(x => x.id === id);
      this.dataStore.districts.splice(index, 1);
      return true;
    }, err => {
      console.log(err);
      return false;
    });
  }

}
