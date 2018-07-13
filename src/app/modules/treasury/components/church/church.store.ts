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

  /* Listagem */
  public loadAll(): void {
    const unit = this.authService.getCurrentUnit();
    this.service.getChurches(unit.id).subscribe((data: Church[]) => {
      this.dataStore.churches = data;
      this._churches.next(Object.assign({}, this.dataStore).churches);
    });
  }

  /* Filtro */
  public searchProcess(search: string) {
    this.search(search);
  }

  private search(search: string) {
    if (search === '' || search === undefined || search === null) {
      this.churches$ = Observable.of(this.dataStore.churches);
    } else {
      this.churches$ = Observable.of(this.dataStore.churches.filter(data => {
        return data.name.toLowerCase().indexOf(search) !== -1
          || data.city.name.toLowerCase().indexOf(search)! == -1
      }));
    }
  }

  /* Remoção */

  public remove(id) {
    this.service.deleteChurch(id).subscribe(() => {
      const index = this.dataStore.churches.findIndex(x => x.id === id);
      this.dataStore.churches.splice(index, 1);
      return true;
    }, err => {
      console.log(err);
      return false;
    });
  }
}
