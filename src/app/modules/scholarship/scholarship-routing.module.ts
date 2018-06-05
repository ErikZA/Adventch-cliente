import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ScholarshipComponent } from './components/process/scholarship.component';
import { AuthGuard } from '../../shared/auth.guard';
import { LayoutComponent } from '../../shared/layout/layout.component';
import { ProcessFormComponent } from './components/process/process-form/process-form.component';
import { ProcessDataComponent } from './components/process/process-data/process-data.component';
import { ResponsibleDataComponent } from './components/responsible/responsible-data/responsible-data.component';
import { ResponsibleLoginComponent } from './components/responsible/responsible-login/responsible-login.component';

const routes: Routes = [
  { path: 'educacao', component: ResponsibleLoginComponent },
  { path: 'educacao/consultar', component: ResponsibleDataComponent, canActivate: [AuthGuard], canLoad: [AuthGuard] },
  { path: 'bolsas', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
    { path: 'dashboard', component: ScholarshipComponent, children: [
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
