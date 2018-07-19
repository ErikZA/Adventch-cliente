import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';
import { Observation } from '../../models/observation';
import { Church } from '../../models/church';
import { User } from '../../../../shared/models/user.model';

@Injectable()
export class ObservationStore {

  observations$: Observable<Observation[]>;
  private _observations: BehaviorSubject<Observation[]>;

  private dataStore: {
    observations: Observation[]
  };

  churches: Church[];
  analysts: User[];
  responsibles: User[];

  constructor(
    private service: TreasuryService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.dataStore = {
      observations: []
    };
    this.init();
  }

  public init() {    
    this._observations = <BehaviorSubject<Observation[]>>new BehaviorSubject([]);
    this.observations$ = this._observations.asObservable();
    this.churches = new Array<Church>();
    this.analysts = new Array<User>();
    this.responsibles = new Array<User>();
  }

  /* Listagem */
  public loadAll(): void {
    const unit = this.authService.getCurrentUnit();
    this.service.getObservations(unit.id).subscribe((data: Observation[]) => {
      this.dataStore.observations = data;
      this.load();
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
          || data.church.name.toLowerCase().indexOf(search) !== -1
          || data.responsible.name.toLowerCase().indexOf(search) !== -1
      });
    }
  }

  public searchStatus(status: number, observations: Observation[]): Observation[] {
    return observations.filter(f => f.status === status);
  }

  public searchChurches(church: number, observations: Observation[]): Observation[] {
    return observations.filter(f => f.church.id === church);
  }

  public searchAnalysts(analyst: number, observations: Observation[]): Observation[] {
    return observations.filter(f => f.church.district.analyst.id === analyst);
  }

  public searchResponsibles(responsible: number, observations: Observation[]): Observation[] {
    return observations.filter(f => f.responsible.id === responsible);
  }

  public searchInDates(startDate: Date, endDate: Date, observations: Observation[]) {
    return observations.filter(f => new Date(f.date) > startDate && new Date(f.date) < endDate);
  }

  /* Carregar */
  private load() {
    this.loadChurches();
    this.loadAnalysts();
    this.loadResponsibles();
  }
  private loadChurches() {
    this.dataStore.observations.forEach(observation => {
      if (this.churches.map(x => x.id).indexOf(observation.church.id) === -1) {
        this.churches.push(observation.church);
      }
    });
    this.churches.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadAnalysts() {
    this.dataStore.observations.forEach(observation => {
      if (this.analysts.map(x => x.id).indexOf(observation.church.district.analyst.id) === -1) {
        this.analysts.push(observation.church.district.analyst);
      }
    });
    this.analysts.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadResponsibles() {
    this.dataStore.observations.forEach(observation => {
      if (this.responsibles.map(x => x.id).indexOf(observation.responsible.id) === -1) {
        this.responsibles.push(observation.responsible);
      }
    });
    this.responsibles.sort((a, b) => a.name.localeCompare(b.name));
  }

  /* Remoção */
  public remove(id) {
    this.service.deleteObservation(id).subscribe(() => {
      const index = this.dataStore.observations.findIndex(x => x.id === id);
      this.dataStore.observations.splice(index, 1);
      this.snackBar.open('Observação removida!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao remover observação, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  /* Finalização */
  public finalize(id) {
    const data = {
      id: id
    }
    this.service.finalizeObservation(data).subscribe((observation: Observation) => {
      this.update(observation);
      this.snackBar.open('Observação finalizada!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao finalizar observação, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  /* Adição */

  /* Util */
  private update(observation: Observation): void {
    const index = this.dataStore.observations.findIndex(x => x.id === observation.id);
    if (index >= 0) {
      this.dataStore.observations[index] = observation;
    } else {
      this.dataStore.observations.push(observation);
    }
    this.dataStore.observations.sort((a, b) => a.church.name.localeCompare(b.church.name));
    this._observations.next(Object.assign({}, this.dataStore).observations);
  }
}
