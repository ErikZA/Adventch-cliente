import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IsLogin } from './actions/auth.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private auth$: Observable<any>;
  public isLogin: boolean;

  constructor(
    private store: Store<any>,
  ) {
    const token = JSON.parse(localStorage.getItem("token"))

    if (token !== undefined && token !== null) {
      this.store.dispatch(IsLogin(true));
    } else {
      this.store.dispatch(IsLogin(false));
    }

    this.auth$ = store.select('auth');
  }

  ngOnInit() {
    this.auth$.subscribe((res: any) => this.isLogin = res)
  }

}
