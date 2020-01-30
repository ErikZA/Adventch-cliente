import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthModel } from 'src/app/models/auth.model';

import { IsLogin } from '../../actions/auth.action';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public isLogin = false;
  authentication$: Observable<AuthModel>;

  constructor(
    private store: Store<any>,
  ) {
    this.authentication$ = store.select('auth');
  }

  ngOnInit() {
    this.authentication$.subscribe((res: any) => this.isLogin = res);
  }

  logout() {
    this.store.dispatch(IsLogin(false));
  }

}
