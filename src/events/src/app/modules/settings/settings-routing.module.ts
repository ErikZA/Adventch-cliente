import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// Components
import { SettingComponent } from './setting/setting.component';
import { FieldsComponent } from './fields/fields.component';
import { ListComponent } from './list/list.component';
import { BankAccountComponent } from './bank-account/bank-account.component';

const routes: Routes = [
  {
    path: '', component: SettingComponent, children: [
      { path: 'campos', component: FieldsComponent },
      { path: 'listas', component: ListComponent },
      { path: 'contas', component: BankAccountComponent },
      { path: '', redirectTo: '/configuracoes/campos', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class SettingsRoutingModule { }
