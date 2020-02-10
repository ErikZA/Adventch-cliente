import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IUrlParams } from '../shared/interfaces/url-params.interface';
import { ActivatedRoute, Params } from '@angular/router';
import { Oauth2Service } from '../shared/services/oauth2.service';
import { switchMap, skipWhile, tap } from 'rxjs/operators';
import { IApp } from 'src/app/apps/shared/queries/get-app-by-clientId/view-model/app.interface';
import { QueriesHandlerService } from '@adventech/ngx-adventech/handlers';
import { AuthService } from '@adventech/ngx-adventech/auth';
import { GetAppByClientIdQuery } from 'src/app/apps/shared/queries/get-app-by-clientId/get-app-by-clientId.query';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

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
    private querieshandler: QueriesHandlerService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.route.queryParams
      .pipe(
        skipWhile(({ client_id }) => !client_id),
        switchMap((queryParams: Params) => this.querieshandler.handle<IApp>(new GetAppByClientIdQuery(queryParams.clientId))),
        tap(app => this.app = app.data[0]),
        tap(() => window.addEventListener('storage', this.storageEventListener.bind(this)))
      ).subscribe((data) => {
        console.log(data);
      });
    // .subscribe(params => {
    //   if (!this.urlParams.client_id) {
    //     return;
    //   }
    //   this.urlParams = {
    //     client_id: params.client_id,
    //     redirect_uri: params.redirect_uri,
    //     response_type: params.response_type,
    //     scope: params.scope,
    //     state: params.state
    //   };

    //   this.appsService
    //     .getAppByClientId(params.client_id)
    //     .subscribe(app => {
    //       this.app = app;
    //       // this.titleService.setTitle(`${app.name}: Login`);
    //     });

    //   window.addEventListener('storage', this.storageEventListener.bind(this));

    //   const lastLogin = localStorage.getItem('lastLogin');
    //   if (lastLogin) {
    //     this.loginForm.patchValue({
    //       email: lastLogin
    //     });
    //   }
    // });
  }

  private initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, Validators.required]
    });
  }

  public loginSubmit(): void {

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
