import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import { Districts } from '../../models/districts';
import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';

import * as moment from 'moment';
import { User } from '../../../../shared/models/user.model';

@Injectable()
export class DistrictsStore {
    districts$: Observable<Districts[]>;
    users: User[] = null;
  private _districts: BehaviorSubject<Districts[]>;
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
    this.districts = new Districts();
  }

    /* Listagem */
    public loadAll(): void {
        const unit = this.authService.getCurrentUnit();
        this.service.getDistricts(unit.id).subscribe((data: Districts[]) => {
          this.dataStore.districts = data;
          this._districts.next(Object.assign({}, this.dataStore).districts);
        });
      }

    /* Abrir sidenav*/
    openDistrict(district) {
      this.districts = district;
    }

    /* Filtro */
    public searchProcess(search: string) {
      this.search(search);
    }

    /*Search*/
    private search(search: string) {
      if (search === '' || search === undefined || search === null) {
        this.districts$ = Observable.of(this.dataStore.districts);
      } else {
        this.districts$ = Observable.of(this.dataStore.districts.filter(data => {
          return data.name.toLowerCase().indexOf(search) !== -1;
        }));
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

    /* Salvar*/
    public updateDistricts(district) {
      const index = this.dataStore.districts.findIndex(x => x.id === Number(district.id));
      if (index >= 0) {
        this.dataStore.districts[index] = district;
        this.dataStore.districts[index].analyst.name = district.analyst.name;
      } else {
        this.dataStore.districts.push(district);
      }
      this.districts = new Districts();
    }

}
