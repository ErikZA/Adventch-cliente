import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'inscricoes', loadChildren: '../app/modules/events/event-register.module#EventRegisterModule', },
  { path: 'eventos', loadChildren: '../app/modules/events/events.module#EventsModule', },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
