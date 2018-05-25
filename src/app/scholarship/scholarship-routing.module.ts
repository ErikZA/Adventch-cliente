import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ScholarshipComponent } from './components/scholarship.component';
import { AuthGuard } from '../shared/auth.guard';
import { LayoutComponent } from '../shared/layout/layout.component';
import { ProcessFormComponent } from './components/process-form/process-form.component';
import { ProcessDataComponent } from './components/process-data/process-data.component';
import { ConsultLoginComponent } from './components/consult-login/consult-login.component';

const routes: Routes = [
  { path: 'consultar-bolsas-login', component: ConsultLoginComponent, canActivate: [AuthGuard], canLoad: [AuthGuard]},
  { path: 'bolsas', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
    { path: 'dashboard', component: ScholarshipComponent, children:[
      { path: 'novo', component: ProcessFormComponent }
    ]},
    { path: 'processos', component: ProcessDataComponent, children: [
      { path: 'novo', component: ProcessFormComponent },
      { path: 'editar', component: ProcessFormComponent}
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScholarshipRoutingModule { }
