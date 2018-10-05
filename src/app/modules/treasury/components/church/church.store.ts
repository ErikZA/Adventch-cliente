import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable ,  BehaviorSubject } from 'rxjs';


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

  private dataStore: {
    churches: Church[]
  };
  public church: Church;

  constructor(
    private service: TreasuryService,
    private snackBar: MatSnackBar,
    private sidenavService: SidenavService
  ) {
    this.dataStore = {
      churches: []
    };
    this._churches = <BehaviorSubject<Church[]>>new BehaviorSubject([]);
    this.churches$ = this._churches.asObservable();

    this.resetChurch();
  }

  /* Listagem */
  public loadAll(): void {
    const unit = auth.getCurrentUnit();
    this.service.getChurches(unit.id).subscribe((data: any[]) => {
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
