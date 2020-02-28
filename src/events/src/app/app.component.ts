import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IsLogin } from './actions/auth.action';
import { Observable } from 'rxjs';
import { AuthService } from './shared/auth/auth.service';

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
    private auth: AuthService,
  ) {
    this.auth$ = store.select('auth');
    this.auth.checkLogin();
  }

  ngOnInit() {
    this.auth$.subscribe(res => this.isLogin = res);
  }

}
