import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { Avaliation, AvaliationList } from '../../models/avaliation';
import { TreasuryService } from '../../treasury.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { auth } from '../../../../auth/auth';
@Injectable()
export class AvaliationStore {

    avaliations$: Observable<AvaliationList[]>;
    private _avaliations: BehaviorSubject<AvaliationList[]>;
    public avaliation: Avaliation;

    private dataStore: {
        avaliations: AvaliationList[]
    };

    constructor(
        private service: TreasuryService,
        private snackBar: MatSnackBar,
        private sidenavService: SidenavService
    ) {
        this.dataStore = {
            avaliations: []
        };
        this._avaliations = <BehaviorSubject<AvaliationList[]>>new BehaviorSubject([]);
        this.avaliations$ = this._avaliations.asObservable();        
    }
    
  /* Listagem */
  public loadAll(): void {
    const unit = auth.getCurrentUnit();
    this.service.getAvaliations(unit.id).subscribe((data: any[]) => {
      this.dataStore.avaliations = data;
      this._avaliations.next(Object.assign({}, this.dataStore).avaliations);
    });
  }
}
