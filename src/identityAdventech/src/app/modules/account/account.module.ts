import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Oauth2Component } from './oauth2/oauth2.component';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotComponent,
    ProfileComponent,
    Oauth2Component
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[]
})
export class AccountModule { }
