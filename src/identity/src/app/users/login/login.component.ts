import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { QueriesHandlerService } from '@adventech/ngx-adventech/handlers';
import { AuthService } from '@adventech/ngx-adventech/auth';
import { switchMap, skipWhile, tap } from 'rxjs/operators';

import { IUrlParams } from '../shared/interfaces/url-params.interface';
import { Oauth2Service } from '../shared/services/oauth2.service';
import { IApp } from 'src/app/apps/shared/queries/get-app-by-clientId/view-model/app.interface';
import { GetAppByClientIdQuery } from 'src/app/apps/shared/queries/get-app-by-clientId/get-app-by-clientId.query';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { MatSnackBar } from '@angular/material';

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
    private oauth2Service: Oauth2Service,
    private authService: AuthService,
    private http: HttpClient,
    private snackBar: MatSnackBar
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

  private storageEventListener(ev: StorageEvent) {
    if (!this.loginRunning && ev.key === 'access_token' && ev.newValue !== null && ev.newValue !== '') {
      this.oauth2Service
        .redirect(this.urlParams.redirect_uri, this.authService.getAccessToken(), this.authService.getIdToken(), this.urlParams.state);
    }
  }

  // public login() {
  //   if (!this.passValue) {
  //     this.translateService.get('login.wrong-password').subscribe(str => {
  //       this.snackBar.open(str, 'OK', { duration: 2000 });
  //     });
  //     this.passwordInput.nativeElement.focus();
  //     return;
  //   }
  //   if (!this.urlParams) {
  //     return;
  //   }
  //   this.loginRunning = true;
  //   this.authService.login(this.params.client_id, this.params.redirect_uri, this.params.response_type, this.params.scope, this.emailValue, this.passValue).subscribe(data => {
  //     if (data.restriction == ECompanyRestrictionType.passwordExpired) {
  //       const dialogRef = this.dialog.open(PasswordRecoveryDialogComponent, { width: '400px', data: { client_id: this.params.client_id, email: this.emailValue } });
  //       const instance = (<PasswordRecoveryDialogComponent>dialogRef.componentInstance);
  //       instance.currentTab = 1;
  //       instance.code = 'changeExpiredPassword';
  //       dialogRef.afterClosed().subscribe();
  //     } else if (data.restriction == ECompanyRestrictionType.emailNotConfirmedRestriction) {
  //       this.authService.sendConfirmationEmail(this.params.client_id, this.emailValue).subscribe(rs => { }, err => {
  //         this.translateService.get('login.email-confirmation-dialog.unable-to-send-email').subscribe(str => {
  //           this.snackBar.open(str, 'OK', { duration: 2000 });
  //         });
  //       });
  //       const dialogRef = this.dialog.open(EmailConfirmationDialogComponent, {
  //         width: '500px',
  //         data: { client_id: this.params.client_id, email: this.emailValue, instructionType: ECompanyRestrictionType.emailNotConfirmedRestriction }
  //       });
  //       dialogRef.afterClosed().subscribe();
  //     } else if (data.restriction == ECompanyRestrictionType.exceededLoginAttempts) {
  //       this.authService.sendExceededLoginAttemptsEmail(this.params.client_id, this.emailValue).subscribe(rs => { }, err => {
  //         this.translateService.get('login.email-confirmation-dialog.unable-to-send-email').subscribe(str => {
  //           this.snackBar.open(str, 'OK', { duration: 2000 });
  //         });
  //       });
  //       const dialogRef = this.dialog.open(EmailConfirmationDialogComponent, {
  //         width: '500px',
  //         data: { client_id: this.params.client_id, email: this.emailValue, instructionType: ECompanyRestrictionType.exceededLoginAttempts }
  //       });
  //       dialogRef.afterClosed().subscribe();
  //     }

  //     if (!data.url) {
  //       this.translateService.get('login.no-url-redirect').subscribe(str => {
  //         this.snackBar.open(str, 'OK', { duration: 2000 });
  //       });
  //       return;
  //     }

  //     if (!this.authService.getAccessToken())
  //       return;
  //     localStorage.setItem('lastLogin', this.emailValue);

  //     this.authService.redirect(data.url, data.access_token, data.id_token, this.params.state);
  //     this.loginRunning = false;
  //   }, error => {
  //     this.loginRunning = false;
  //     if (error.status === 401) {
  //       this.translateService.get('login.wrong-password').subscribe(str => {
  //         this.snackBar.open(str, 'OK', { duration: 2000 });
  //         this.passwordInput.nativeElement.value = '';
  //         this.passwordInput.nativeElement.focus();
  //       });
  //     }
  //   });
  // }



}
