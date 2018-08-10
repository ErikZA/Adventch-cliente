import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { Church } from '../../models/church';
import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { Districts } from '../../models/districts';
import { City } from '../../../../shared/models/city.model';
import { User } from '../../../../shared/models/user.model';
import { auth } from '../../../../auth/auth';

@Injectable()
export class ChurchStore {

  churches$: Observable<Church[]>;
  private _churches: BehaviorSubject<Church[]>;

  cities$: Observable<City[]>;
  private _cities: BehaviorSubject<City[]>;

  analysts$: Observable<User[]>;
  private _analysts: BehaviorSubject<User[]>;

  private dataStore: {
    churches: Church[],
    cities: City[],
    analysts: User[]
  };
  public church: Church;

  constructor(
    private service: TreasuryService,
    private snackBar: MatSnackBar,
    private sidenavService: SidenavService
  ) {
    this.dataStore = {
      churches: [],
      cities: [],
      analysts: []
    };
    this._churches = <BehaviorSubject<Church[]>>new BehaviorSubject([]);
    this.churches$ = this._churches.asObservable();

    this._cities = <BehaviorSubject<City[]>>new BehaviorSubject([]);
    this.cities$ = this._cities.asObservable();

    this._analysts = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    this.analysts$ = this._analysts.asObservable();

    this.resetChurch();
  }

  /* Listagem */
  public loadAll(): void {
    const unit = auth.getCurrentUnit();
    this.service.getChurches(unit.id).subscribe((data: Church[]) => {
      this.dataStore.churches = data;
      this._churches.next(Object.assign({}, this.dataStore).churches);
    });
  }

  /* Filtro */
  public searchText(search: string): Church[] {
    if (search === '' || search === undefined || search === null) {
      return this.dataStore.churches;
    } else {
      return this.dataStore.churches.filter(data => {
        return data.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          || data.district.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          || data.district.analyst.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          || data.city.name.toLowerCase().indexOf(search.toLowerCase()) !== -1
          || data.city.state.acronym.toLowerCase().indexOf(search.toLowerCase()) !== -1;
      });
    }
  }

  public searchDistricts(idDistrict: number, churches: Church[]): Church[] {
    // tslint:disable-next-line:triple-equals
    return churches.filter(x => x.district.id == idDistrict);
  }

  public searchCities(idCity: number, churches: Church[]): Church[] {
    // tslint:disable-next-line:triple-equals
    return churches.filter(x => x.city.id == idCity);
  }

  public searchAnalysts(idAnalyst: number, churches: Church[]): Church[] {
    // tslint:disable-next-line:triple-equals
    return churches.filter(x => x.district.analyst.id == idAnalyst);
  }

  /* Carregar */
  public loadFilters() {
    this.loadCities();
    this.loadAnalysts();
  }
  private loadCities() {
    this.dataStore.cities = new Array<City>();
    if (!this.dataStore.churches) {
      this.dataStore.churches.forEach(church => {
        if (this.dataStore.cities.map(x => x.id).indexOf(church.city.id) === -1) {
          this.dataStore.cities.push(church.city);
        }
      });
      this._cities.next(Object.assign({}, this.dataStore).cities);
      this.dataStore.cities.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  private loadAnalysts() {
    this.dataStore.analysts = new Array<User>();
    if (!this.dataStore.churches) {
      this.dataStore.churches.forEach(church => {
        if (church.district.id !== 0 && this.dataStore.analysts.map(x => x.id).indexOf(church.district.analyst.id) === -1) {
          this.dataStore.analysts.push(church.district.analyst);
        }
      });
      this._analysts.next(Object.assign({}, this.dataStore).analysts);
      this.dataStore.analysts.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  /* Remoção */
  public remove(id) {
    this.service.deleteChurch(id).subscribe(() => {
      const index = this.dataStore.churches.findIndex(x => x.id === id);
      this.dataStore.churches.splice(index, 1);
      this.snackBar.open('Igreja removida!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao remover igreja, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  /* Atualização */
  public update(church: Church): void {
    const index = this.dataStore.churches.findIndex(x => x.id === church.id);
    if (index >= 0) {
      this.dataStore.churches[index] = church;
    } else {
      this.dataStore.churches.push(church);
    }
    this.dataStore.churches.sort((a, b) => a.name.localeCompare(b.name));
    this._churches.next(Object.assign({}, this.dataStore).churches);
    this.resetChurch();
  }

  private resetChurch() {
    this.church = new Church();
    this.church.id = 0;
  }
}
