import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', redirectTo: 'r', pathMatch: 'full' },
  {
    path: 'e',
    loadChildren: './events/events.module#EventsModule',
  },
  {
    path: 'r',
    loadChildren: './registrations/registrations.module#RegistrationsModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
