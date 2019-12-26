import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './components/login/main/main.component';
import { ResponsibleComponent } from './components/login/responsible/responsible.component';
import { RecoverMainComponent } from './components/password/recover/recover-main/recover-main.component';

const routes: Routes = [
  { path: 'login', component: MainComponent },
  { path: 'educacao', component: ResponsibleComponent },
  { path: 'recuperar-senha', component: RecoverMainComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
