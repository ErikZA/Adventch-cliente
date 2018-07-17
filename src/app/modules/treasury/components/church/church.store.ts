import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { Church } from '../../models/church';
import { TreasuryService } from '../../treasury.service';
import { AuthService } from '../../../../shared/auth.service';
import { SidenavService } from '../../../../core/services/sidenav.service';

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
    private authService: AuthService,
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
          || data.city.name.toLowerCase().indexOf(search) !== -1
          || data.city.state.acronym.toLowerCase().indexOf(search) !== -1
      }));
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

  /* Adição */
  public save(data) {
    this.service.saveChurch(data).subscribe((church: Church) => {
      this.update(church);
      this.sidenavService.close();
      this.resetChurch();
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao salvar igreja, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  private update(church: Church): void {
    const index = this.dataStore.churches.findIndex(x => x.id === church.id);
    if (index >= 0) {
      this.dataStore.churches[index] = church;
    } else {
      this.dataStore.churches.push(church);
    }
    this._churches.next(Object.assign({}, this.dataStore).churches);
  }

  private resetChurch() {
    this.church = new Church();
    this.church.id = 0;
  }
}
