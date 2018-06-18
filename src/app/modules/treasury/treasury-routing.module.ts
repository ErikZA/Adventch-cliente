import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../shared/layout/layout.component';

import { AuthGuard } from '../../shared/auth.guard';

import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';

const routes: Routes = [
  { path: 'tesouraria', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
    { path: 'tesoureiros', component: TreasurerDataComponent, children: [
      { path: 'novo', component: TreasurerFormComponent },
      { path: 'editar', component: TreasurerFormComponent }
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryRoutingModule { }
