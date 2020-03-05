import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './shared/auth/auth.guard';
import { AuthRouteService } from './shared/auth/authRoute.guard';
import { HomeComponent } from './modules/home/home.component';

const routes: Routes = [
  { path: 'inscricoes', loadChildren: '../app/modules/events/event-register.module#EventRegisterModule', canActivate: [AuthGuard] },
  { path: 'eventos', loadChildren: '../app/modules/events/events.module#EventsModule', canActivate: [AuthGuard] },
  { path: 'configuracoes', loadChildren: '../app/modules/settings/settings.module#SettingsModule', canActivate: [AuthGuard] },
  { path: '', component: HomeComponent, canActivate: [AuthRouteService] },
  { path: ':id', loadChildren: './modules/subscription/subscription.module#SubscriptionModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
