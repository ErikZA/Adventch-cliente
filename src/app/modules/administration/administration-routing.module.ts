import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { LayoutComponent } from '../../shared/layout/layout.component';
import { ProfileDataComponent } from './components/profile/profile-data/profile-data.component';
import { ProfileFormComponent } from './components/profile/profile-form/profile-form.component';
import { UserDataComponent } from './components/user/user-data/user-data.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';

const routes: Routes = [
  { path: 'papeis', component: LayoutComponent, children: [
    { path: '', component: ProfileDataComponent, children: [
      { path: 'novo', component: ProfileFormComponent },
      { path: ':id/editar', component: ProfileFormComponent },
    ]},
  ]},
  { path: 'usuarios', component: LayoutComponent, children: [
    { path: '', component: UserDataComponent, children: [
      { path: 'novo', component: UserFormComponent },
      { path: ':id/editar', component: UserFormComponent },
    ]},
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministratioRoutingModule { }
