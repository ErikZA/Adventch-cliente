import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';
import { Observation } from '../../models/observation';

@Injectable()
export class ObservationStore {

  observations$: Observable<Observation[]>;
  private _observations: BehaviorSubject<Observation[]>;

  private dataStore: {
    observations: Observation[],
  };

  constructor(
    private service: TreasuryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.dataStore = {
      observations: []
    };
    this._observations = <BehaviorSubject<Observation[]>>new BehaviorSubject([]);
    this.observations$ = this._observations.asObservable();
  }

  /* Listagem */
  public loadAll(): void {
    const unit = this.authService.getCurrentUnit();
    this.service.getObservations(unit.id).subscribe((data: Observation[]) => {
      this.dataStore.observations = data;
      this._observations.next(Object.assign({}, this.dataStore).observations);
    });
  }

  /* Filtro */
  public searchText(search: string): Observation[] {
    if (search === '' || search === undefined || search === null) {
      return this.dataStore.observations;
    } else {
      return this.dataStore.observations.filter(data => {
        return data.description.toLowerCase().indexOf(search) !== -1
      });
    }
  }

  /* Carregar */

  /* Remoção */
  public remove(id) {
    this.service.deleteObservation(id).subscribe(() => {
      const index = this.dataStore.observations.findIndex(x => x.id === id);
      this.dataStore.observations.splice(index, 1);
      this.snackBar.open('Observação removida!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao remover ovservação, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  /* Adição */
}
