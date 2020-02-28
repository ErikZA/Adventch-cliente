import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmptyComponent } from '../shared/components/empty/empty.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: '', children: [
      { path: 'authorize', component: LoginComponent },
      { path: 'callback', component: EmptyComponent },
      { path: 'logout', component: EmptyComponent },
      { path: 'setTokens', component: EmptyComponent },
      { path: '', redirectTo: 'authorize', pathMatch: 'full' },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
