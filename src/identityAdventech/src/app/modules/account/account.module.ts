import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Components
import { LoginComponent } from './login/login.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    LoginComponent,
    ForgotComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[]
})
export class AccountModule { }
