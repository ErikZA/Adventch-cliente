import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatSnackBar } from '@angular/material';

import { AuthService } from '../auth.service';
import { SharedService } from '../shared.service';

import { User } from '../models/user.model';
import { auth } from '../../auth/auth';

@Injectable()
export class ProfileStore {

  user$: Observable<User>;
  private _user: BehaviorSubject<User>;
  private dataStore: {
    user: User
  };

  constructor(
    private service: SharedService,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.dataStore = {
      user: auth.getCurrentUser()
    };
    this._user = <BehaviorSubject<User>>new BehaviorSubject({});
    this.user$ = this._user.asObservable();
  }


  public loadUser(id: number): void {
    this.service.getUser(id).subscribe(data => {
      this.dataStore.user = data;
      this._user.next(Object.assign({}, this.dataStore).user);
    }, error => console.log('Could not load todo.'));
  }

  public saveUser(dataUser: User): void {
    this.service.saveUser(dataUser).subscribe(() => {
      const user = auth.getCurrentUser();
      user.name = dataUser.name;
      user.firstName = dataUser.name.split(' ')[0];
      auth.setCurrentUser(user);
      this.snackBar.open('Usuário atualizado com sucesso!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao salvar o papel, tente novamente.', 'OK', { duration: 5000 });
    });
  }

}
