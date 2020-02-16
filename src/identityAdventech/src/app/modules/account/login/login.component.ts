import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { Store } from '@ngrx/store';
import { IsLogin } from 'src/app/action/auth.action';
import { Router } from '@angular/router';
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

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private store: Store<any>,
    private router: Router,
    private jwt: JwtHelperService,
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  public login(): void {
    const { email, password } = this.loginForm.value;
    this.http.post(`${this.uri}/Users/login`, JSON.stringify({
      email,
      password,
      client_id: environment.client_id,
      redirect_uri: environment.redirect_url
    })).subscribe((res: any) => {
      const { access_token, id_token } = res.resultData;
      const user = this.jwt.decodeToken(id_token);
      localStorage.setItem("token", JSON.stringify(access_token))
      localStorage.setItem("user", JSON.stringify(user))
      this.auth.getUser();
      this.store.dispatch(IsLogin(true));
      this.router.navigate(['/']);
    })
  }

}
