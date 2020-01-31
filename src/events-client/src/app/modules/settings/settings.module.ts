import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingComponent } from './setting/setting.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AccountComponent } from './account/account.component';
import { FieldsComponent } from './fields/fields.component';
import { ListComponent } from './list/list.component';
import { SettingService } from './setting.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    SettingComponent,
    AccountComponent,
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
  ]
})
export class SettingsModule { }
