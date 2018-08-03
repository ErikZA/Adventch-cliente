import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { Treasurer } from '../../models/treasurer';
import { TreasuryService } from '../../treasury.service';
import { AuthService } from './../../../../shared/auth.service';

import * as moment from 'moment';

@Injectable()
export class TreasurerStore {

  treasurers$: Observable<Treasurer[]>;
  private _treasurers: BehaviorSubject<Treasurer[]>;
  private dataStore: {
    treasurers: Treasurer[]
  };
  public treasurer: Treasurer;

  constructor(
    private service: TreasuryService,
    private authService: AuthService
  ) {
    this.dataStore = {
      treasurers: []
    };
    this._treasurers = <BehaviorSubject<Treasurer[]>>new BehaviorSubject([]);
    this.treasurers$ = this._treasurers.asObservable();

    this.treasurer = new Treasurer();

    moment.locale('pt');
  }

  public loadAll() {
    this.loadAllTreasurers();
  }

  public searchTreasurers(search) {
    if (search === '' || search === undefined || search === null) {
      this.treasurers$ = Observable.of(this.dataStore.treasurers);
    } else {
      this.treasurers$ = Observable.of(this.dataStore.treasurers.filter(data => {
        return data.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
        || data.church.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
        || data.functionName.toLowerCase().indexOf(search.toLowerCase()) !== -1;
      }));
    }
  }

  public editTreasurer(treasurer) {
    this.treasurer = treasurer;
  }

  public updateTreasurers(treasurer) {
    treasurer.functionName = this.getFunctionName(treasurer.function);
    if (treasurer.dateRegister != null) {
      treasurer.dateRegister = new Date(treasurer.dateRegister);
      treasurer.dateRegisterFormatted = moment(treasurer.dateRegister).fromNow();
    }

    const index = this.dataStore.treasurers.findIndex(x => x.id === treasurer.id);
    if (index >= 0) {
      this.dataStore.treasurers[index] = treasurer;
    } else {
      this.dataStore.treasurers.push(treasurer);
    }
    this.treasurer = new Treasurer();
  }

  public removeTreasurer(treasurer) {
    const index = this.dataStore.treasurers.findIndex(x => x.id === treasurer.id);
    this.dataStore.treasurers.splice(index, 1);
  }

  private getFunctionName(idFunction) {
    if (idFunction === 1) {
      return 'Tesoureiro (a)';
    } else if (idFunction === 2) {
      return 'Associado (a)';
    }
    return 'Assistente';
  }

  private loadAllTreasurers(): void {
    const unit = this.authService.getCurrentUnit();
    this.service.getTreasurers(unit.id).subscribe((data: Treasurer[]) => {
      debugger;
      this.dataStore.treasurers = data;
      this.formatTreasurers();
      this._treasurers.next(Object.assign({}, this.dataStore).treasurers);
    });
  }

  private formatTreasurers() {
    if (this.dataStore.treasurers === null || this.dataStore.treasurers === undefined) {
      return;
    }
    this.dataStore.treasurers.forEach(
      item => {
        item.functionName = this.getFunctionName(item.function);
        if (item.dateRegister != null) {
          item.dateRegister = new Date(item.dateRegister);
          item.dateRegisterFormatted = moment(item.dateRegister).fromNow();
        }
      }
    );
  }
}
