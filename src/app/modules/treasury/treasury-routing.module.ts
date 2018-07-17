import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../shared/layout/layout.component';

import { AuthGuard } from '../../shared/auth.guard';

import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';
import { ChurchDataComponent } from './components/church/church-data/church-data.component';
import { ChurchFormComponent } from './components/church/church-form/church-form.component';
import { DistrictsDataComponent } from './components/districts/districts-data/districts-data.component';
import { DistrictsFormComponent } from './components/districts/districts-form/districts-form.component';

const routes: Routes = [
  { path: 'tesouraria', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
    { path: 'tesoureiros', component: TreasurerDataComponent, children: [
      { path: 'novo', component: TreasurerFormComponent },
      { path: 'editar', component: TreasurerFormComponent }
    ]},
    { path: 'igrejas', component: ChurchDataComponent, children: [
      { path: 'novo', component: ChurchFormComponent },
      { path: ':id/editar', component: ChurchFormComponent }
    ]},
    { path: 'distritos', component: DistrictsDataComponent, children: [
      { path: 'novo', component: DistrictsFormComponent },
      { path: ':id/editar', component: DistrictsFormComponent }
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryRoutingModule { }
