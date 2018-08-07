import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators';
import 'rxjs/add/observable/of';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../../../../shared/auth.service';
import { AdministrationService } from '../../administration.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { EModules } from '../../../../shared/models/modules.enum';
import { User } from '../../../../shared/models/user.model';
import { auth } from '../../../../auth/auth';

@Injectable()
export class UserStore {

  users$: Observable<User[]>;
  private _users: BehaviorSubject<User[]>;
  private modulesFilters: EModules[];
  private dataStore: {
    users: User[]
  };

  constructor(
    private service: AdministrationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private location: Location,
    private sidenavService: SidenavService
  ) {
    this.dataStore = {
      users: []
    };
    this.modulesFilters = new Array<EModules>();
    this._users = <BehaviorSubject<User[]>>new BehaviorSubject([]);
    this.users$ = this._users.asObservable();
  }

  public loadAllUsers(): void {
    const { id } = auth.getCurrentUnit();
    this.service.getUsers(id).subscribe((data: User[]) => {
      data.sort((a, b) => a.name.localeCompare(b.name));
      this.dataStore.users = data;
      this._users.next(Object.assign({}, this.dataStore).users);
    }, error => console.log('Could not load todos roles.'));
  }

  public loadUser(id: number): Observable<User> {
    const unitId = auth.getCurrentUnit().id;
    return this.service.getUser(id, unitId);
  }

  private load(id: number) {
    this.loadUser(id).subscribe(data => {
      let notFound = true;
      this.dataStore.users.forEach((item, index) => {
        if (item.id === data.id) {
          this.dataStore.users[index] = data;
          notFound = false;
        }
      });
      if (notFound) {
        this.dataStore.users.push(data);
      }
      this._users.next(Object.assign({}, this.dataStore).users);
    }, error => console.log('Could not load todo.'));
  }

  public searchUser(search: string): Observable<User[]> {
    search = search.toLowerCase();
    const birthdayNull = 'Não Informado';
    const users = this.filterUsersProfilesModules();
    if (search === '') {
      return Observable.of(users);
    }
    return Observable.of(users.filter(data => {
      return data.name.toLowerCase().indexOf(search) !== -1
        || data.email.toLowerCase().indexOf(search) !== -1
        || data.birthday && data.birthday.toLocaleString().toLowerCase().indexOf(search) !== -1
        || !data.birthday && birthdayNull.toLowerCase().indexOf(search) !== -1
        || data.profiles.some(p => p.name.toLowerCase().indexOf(search) !== -1);
    }));
  }

  public filterModules(module: EModules, checked: boolean): Observable<User[]> {
    const { modules } = auth.getCurrentUnit();
    if (!modules.some(x => x === module)) {
      return;
    } else if (!checked && this.modulesFilters.some(x => x === module)) {
      this.modulesFilters.splice(this.modulesFilters.indexOf(module), 1);
    } else if (checked && !this.modulesFilters.some(x => x === module)) {
      this.modulesFilters.push(module);
    }
    return Observable.of(this.filterUsersProfilesModules());
  }

  private filterUsersProfilesModules(): User[] {
    if (this.modulesFilters.length !== 0) {
      const users: User[] = Object.create(this.dataStore.users);
      const usersFiltersModules = users.filter(data => {
        if (data.profiles.length !== 0) {
          return data.profiles.filter(p => {
            return this.modulesFilters.some(x => x === p.software);
          });
        }
      });
      return usersFiltersModules;
    } else {
      return this.dataStore.users;
    }
  }
  private handleSuccess() {
    this.searchUser('');
    this.loadAllUsers();
    setTimeout(() => {
      this.location.back();
      this.sidenavService.close();
      this.snackBar.open('Usuário salvo com sucesso.', 'OK', { duration: 5000 });
    }, 1000);
  }
  private handleFail(err = null) {
    console.log(err);
      if (err.status === 409) {
        this.snackBar.open(err.error + ', tente novamente.', 'OK', { duration: 5000 });
      } else {
        this.snackBar.open('Erro ao salvar o usuário, tente novamente.', 'OK', { duration: 5000 });
      }
  }
  public saveUser(userData: any): void {
    if (userData.id) {
      this.service.editUser(userData, userData.id).subscribe((res) => {
        this.load(userData.id);
        this.handleSuccess();
      }, err => {
        this.handleFail(err);
      });
    } else {
      this.service.saveUser(userData).subscribe((res) => {
        console.log(res);
        this.handleSuccess();
      }, err => {
        this.handleFail(err);
      });
    }

  }

  public removeUser(id: number): void {
    this.service.deleteUser(id).subscribe(() => {
      this.dataStore.users.forEach((u, i) => {
        if (u.id === id) {
          this.dataStore.users.splice(i, 1);
        }
      });
      this._users.next(Object.assign({}, this.dataStore).users);
      this.snackBar.open('Usuário removido com sucesso!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao remover usuário, tente novamente.', 'OK', { duration: 5000 });
    });
  }
}
