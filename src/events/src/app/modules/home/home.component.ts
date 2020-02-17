import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from '../../../environments/environment';
import { IsLogin } from 'src/app/actions/auth.action';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public urlIdentity = environment.identityApi;

  constructor(
    private activedRouter: ActivatedRoute,
    private router: Router,
    private store: Store<any>,
    private jwt: JwtHelperService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.activedRouter.queryParams.subscribe((res: any) => {
      if (res.token !== undefined && res.token !== null) {
        const { sub } = this.jwt.decodeToken(res.token)
        localStorage.setItem("token", JSON.stringify(res.token))
        localStorage.setItem("user", JSON.stringify({ id: sub, alias: res.alias }))
        this.auth.getUser();
        this.store.dispatch(IsLogin(true));
        this.router.navigate(['/eventos'])
      }
    });
  }

}
