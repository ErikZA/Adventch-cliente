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

import * as moment from 'moment';

@Injectable()
export class ObservationStore {

  observations$: Observable<Observation[]>;
  private _observations: BehaviorSubject<Observation[]>;

  private dataStore: {
    observations: Observation[]
  };

  public observations: Observation;

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
    moment.locale('pt');
  }

  public init() {
    this._observations = <BehaviorSubject<Observation[]>>new BehaviorSubject([]);
    this.observations$ = this._observations.asObservable();
    this.churches = new Array<Church>();
    this.analysts = new Array<User>();
    this.responsibles = new Array<User>();
  }

  loadObservation(id: number) {
    return this.dataStore.observations.filter(x => x.id == id);
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
        return data.description.toLowerCase().indexOf(search.toLowerCase()) !== -1
          || data.church.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          || data.responsible.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          || moment(data.date).format('DD/MM/YYYY').toString().indexOf(search.toLowerCase()) !== -1
          || this.filterStatus(search.toLowerCase(), data.status)
      });
    }
  }

  private filterStatus(search: string, status: number): boolean {
    if (status === 1) {
      return 'aberta'.indexOf(search) !== -1;
    }
    if (status === 2) {
      return 'finalizada'.indexOf(search) !== -1;
    }
    return false;
  }

  public searchStatus(status: number, observations: Observation[]): Observation[] {
    return observations.filter(f => f.status == status);
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
    //this.churches = new Array<Church>();
    this.dataStore.observations.forEach(observation => {
      if (this.churches.map(x => x.id).indexOf(observation.church.id) === -1) {
        this.churches.push(observation.church);
      }
    });
    this.churches.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadAnalysts() {
    //this.analysts = new Array<User>();
    this.dataStore.observations.forEach(observation => {
      if (this.analysts.map(x => x.id).indexOf(observation.church.district.analyst.id) === -1) {
        this.analysts.push(observation.church.district.analyst);
      }
    });
    this.analysts.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadResponsibles() {
    //this.responsibles = new Array<User>();
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
    };
    this.service.finalizeObservation(data).subscribe((observation: Observation) => {
      this.update(observation);
      this.snackBar.open('Observação finalizada!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao finalizar observação, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  /* Util */
  public update(observation): void {
    if (this.dataStore.observations === null) {
      this.dataStore.observations = new Array<Observation>();
      this.dataStore.observations.push(observation);
    } else {
      const index = this.dataStore.observations.findIndex(x => x.id == observation.id);
      if (index >= 0) {
        this.dataStore.observations[index] = observation;
      } else {
        this.dataStore.observations.push(observation);
      }
    }
    //this.dataStore.observations.sort((a, b) => a.church.name.localeCompare(b.church.name));
    this._observations.next(Object.assign({}, this.dataStore).observations);
  }

  public loadFilters() {
    this.churches = new Array<Church>();
    this.churches = new Array<Church>();
    this.churches = new Array<Church>();
    this.load();
  }
}
