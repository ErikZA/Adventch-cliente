import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './shared/auth/auth.guard';

const routes: Routes = [
  { path: 'inscricoes', loadChildren: '../app/modules/events/event-register.module#EventRegisterModule', canActivate: [AuthGuard] },
  { path: 'eventos', loadChildren: '../app/modules/events/events.module#EventsModule', canActivate: [AuthGuard] },
  { path: 'configuracoes', loadChildren: '../app/modules/settings/settings.module#SettingsModule', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
