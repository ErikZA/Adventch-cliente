import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ScholarshipComponent } from './components/scholarship.component';
import { AuthGuard } from '../shared/auth.guard';
import { LayoutComponent } from '../shared/layout/layout.component';
import { ProcessDataComponent } from './components/process-data/process-data.component';

const routes: Routes = [
  { path: 'bolsas', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
    { path: 'processos', component: ProcessDataComponent },
    { path: 'dashboard', component: ScholarshipComponent }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScholarshipRoutingModule { }
