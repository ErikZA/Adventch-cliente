import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { IsLogin } from 'src/app/action/auth.action';
import { Router, ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private uri = environment.identityApiUrl;
  public loginForm: FormGroup

  private client_id: string;
  private redirect_url: string;
  private isRedirect = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private store: Store<any>,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private jwt: JwtHelperService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })

    this.activeRouter.queryParams.subscribe(res => {
      const { client_id, redirect_url } = res;
      if (client_id !== undefined && redirect_url !== undefined) {
        this.client_id = client_id;
        this.redirect_url = redirect_url;
        this.isRedirect = true;
      } else {
        this.client_id = environment.client_id;
        this.redirect_url = environment.redirect_url;
      }
    })

  }

  public login(): void {
    const { email, password } = this.loginForm.value;
    this.http.post(`${this.uri}/Users/login`, JSON.stringify({
      email,
      password,
      client_id: this.client_id,
      redirect_uri: this.redirect_url
    })).subscribe((res: any) => {
      const { access_token, id_token } = res.resultData;
      const { sub, name, email, default_company_alias } = this.jwt.decodeToken(id_token);
      localStorage.setItem("token", JSON.stringify(access_token))
      localStorage.setItem("user", JSON.stringify({ id: sub, name, email, alias: default_company_alias }))
      this.auth.getUser();
      this.store.dispatch(IsLogin(true));
      if (this.isRedirect) {
        window.location.href = `${this.redirect_url}/?token=${access_token}&alias=${default_company_alias}`;
        this.isRedirect = false;
      } else {
        this.router.navigate(['/']);
      }

    })
  }

}
