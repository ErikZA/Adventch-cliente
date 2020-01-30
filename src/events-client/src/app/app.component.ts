import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { IsLogin } from './actions/auth.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private store: Store<any>,
  ) {
    this.store.dispatch(IsLogin(false));
  }

  entrar() {
    this.store.dispatch(IsLogin(true));
  }

}
