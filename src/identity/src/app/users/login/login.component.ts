import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { IUrlParams } from '../shared/interfaces/url-params.interface';
import { IApp } from 'src/app/apps/shared/queries/get-app-by-clientId/view-model/app.interface';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private client_id: string;
  private redirect_uri: string;

  hide = true;
  loginForm: FormGroup;
  urlParams: IUrlParams;
  loginRunning = false;
  app: IApp;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.initForm();

    this.route.queryParams.subscribe((res: any) => {
      const { client_id, redirect_uri } = res;

      if (client_id !== undefined && redirect_uri !== undefined) {
        this.client_id = client_id;
        this.redirect_uri = redirect_uri;
      } else {
        this.client_id = environment.client_id;
        this.redirect_uri = `http://${window.location.host}`;
      }
    })


    const lastLogin = localStorage.getItem('lastLogin');
    if (lastLogin) {
      this.loginForm.patchValue({
        email: lastLogin
      });
    }
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  public loginSubmit(): void {
    const { email, password } = this.loginForm.value;
    const form = {
      client_id: this.client_id,
      redirect_uri: this.redirect_uri,
      response_type: "token",
      email,
      password
    }

    this.http.post(`${environment.identityApiUrl}/Users/login`, JSON.stringify(form)).subscribe((res: any) => {
      const { access_token, url } = res.resultData;
      const email = this.loginForm.controls["email"].value
      localStorage.setItem("lastLogin", email);
      localStorage.setItem("token", access_token);
      window.location.href = url
      this.snackBar.open('Login OK.', 'LOGIN', { duration: 3000 })
    }, err => {
      this.snackBar.open('Email ou Senha invalidos.', 'LOGIN', { duration: 3000 })
    });

  }

}
