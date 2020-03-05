import { Component, OnInit, OnChanges, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthModel } from 'src/app/models/auth.model';

import { IsLogin } from '../../actions/auth.action';
import { environment } from 'src/environments/environment';
import { Sidebar } from 'src/app/actions/sidebar.action';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  private authentication$: Observable<AuthModel>;
  private user$: Observable<any>;
  private sidebar$: Observable<any>;
  public open: boolean;

  public isLogin = false;
  public user;
  public urlIdentity = environment.identityApi;
  public sizeWindow: any;

  constructor(
    private store: Store<any>,
  ) {
    this.authentication$ = store.select('auth');
    this.user$ = store.select('user')
    this.sidebar$ = store.select('sidebar')
    this.user$.subscribe((res) => this.user = res);
  }

  ngOnInit() {
    this.authentication$.subscribe((res: any) => this.isLogin = res);
    this.sidebar$.subscribe((res: any) => this.open = res.open);
  }

  logout() {
    this.store.dispatch(IsLogin(false));
  }

  openSidebar() {
    this.store.dispatch(Sidebar(!this.open, "side"))
  }

}
