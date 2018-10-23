import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentProcessDataComponent } from './components/student-process-data/student-process-data.component';

const routes: Routes = [
  {
    path: 'consultar',
    component: StudentProcessDataComponent,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResponsibleRoutingModule { }
