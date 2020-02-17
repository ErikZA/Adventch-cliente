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

@NgModule({
  declarations: [
    SettingComponent,
    FieldsComponent,
    ListComponent
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
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  ]
})
export class SettingsModule { }
