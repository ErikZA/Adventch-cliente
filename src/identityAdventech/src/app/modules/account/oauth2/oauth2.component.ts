import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { IsLogin } from 'src/app/action/auth.action';

@Component({
  selector: 'app-oauth2',
  templateUrl: './oauth2.component.html',
  styleUrls: ['./oauth2.component.scss']
})
export class Oauth2Component implements OnInit {

  private auth$: Observable<any>;
  private isLogin: boolean;

  constructor(
    private routerActived: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private store: Store<any>,
    private jwt: JwtHelperService,
    private auth: AuthService
  ) {
    this.auth$ = store.select('auth');
  }

  ngOnInit() {
    this.auth$.subscribe(res => this.isLogin = res);

    this.routerActived.queryParams.subscribe((res: any) => {
      const { client_id, redirect_url } = res;
      if (client_id !== undefined && redirect_url !== undefined) {
        if (this.isLogin) {
          this.redirect_url(redirect_url)
        }
      } else {
        // this.router.navigate(['/']);
      }
    })
  }

  redirect_url(url: string) {
    const token = JSON.parse(localStorage.getItem("token"));
    const { alias } = JSON.parse(localStorage.getItem("user"));
    this.auth.validToken(token).then((res: any) => {
      console.log(res);
      if (res.data[0].isValid) {
        window.location.href = `${url}/?token=${token}&alias=${alias}`
      } else {
        localStorage.clear();
        this.store.dispatch(IsLogin(false));
      }
    })
  }

}
