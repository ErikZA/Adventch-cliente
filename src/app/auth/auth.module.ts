import { CoreModule } from '../core/core.module';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginStore } from './components/login/login.store';
import { RecoverStore } from './components/password/recover/recover.store';

import { AuthService } from './auth.service';
import { MainComponent } from './components/login/main/main.component';
import { ResponsibleComponent } from './components/login/responsible/responsible.component';
import { ContainerImageComponent } from './components/container-image/container-image.component';
import { LoginDynamicFormComponent } from './components/login/login-dynamic-form/login-dynamic-form.component';
import { RecoverMainComponent } from './components/password/recover/recover-main/recover-main.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AuthRoutingModule
  ],
  declarations: [
    MainComponent,
    ResponsibleComponent,
    ContainerImageComponent,
    LoginDynamicFormComponent,
    RecoverMainComponent
  ],
  exports: [
    AuthRoutingModule
  ],
  providers: [
    AuthService,
    LoginStore,
    RecoverStore
  ]
})
export class AuthModule { }
