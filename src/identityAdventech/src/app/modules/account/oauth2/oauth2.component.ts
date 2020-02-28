import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/shared/auth/auth.service';

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
        this.auth.getUser();
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
    window.location.href = `${url}/?token=${token}&alias=${alias}`
  }

}
