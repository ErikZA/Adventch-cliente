import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpRequestInterceptor } from 'src/app/shared/http-interceptor';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingComponent } from './setting/setting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FieldsComponent } from './fields/fields.component';
import { ListComponent } from './list/list.component';
import { SettingService } from './setting.service';
import { FieldsService } from './fields/fields.service';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { BankAccountService } from './bank-account/bank-account.service';
import { BankAccountFormComponent } from './bank-account/bank-account-form/bank-account-form.component';
import { ListFormComponent } from './list/list-form/list-form.component';
import { ListService } from './list/list.service';
import { FieldFormComponent } from './fields/field-form/field-form.component';
import { CieloAccountComponent } from './cielo-account/cielo-account.component';
import { CieloAccountFormComponent } from './cielo-account/cielo-account-form/cielo-account-form.component';

@NgModule({
  declarations: [
    SettingComponent,
    FieldsComponent,
    ListComponent,
    BankAccountComponent,
    BankAccountFormComponent,
    ListFormComponent,
    FieldFormComponent,
    CieloAccountComponent,
    CieloAccountFormComponent
  ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    FormsModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [
    SettingService,
    FieldsService,
    BankAccountService,
    ListService,
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  ],
  entryComponents: [
    BankAccountFormComponent,
    ListFormComponent,
    FieldFormComponent,
    CieloAccountFormComponent
  ]
})
export class SettingsModule { }
