import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './shared/auth/auth.guard';
import { LoginComponent } from './modules/account/login/login.component';
import { ForgotComponent } from './modules/account/forgot/forgot.component';
import { AuthRouteService } from './shared/auth/authRoute.guard';
import { SubscriptionListComponent } from './modules/subscription/subscription-list/subscription-list.component';
import { SubscriptionComponent } from './modules/subscription/subscription/subscription.component';

const routes: Routes = [
  { path: 'inscricoes', loadChildren: '../app/modules/events/event-register.module#EventRegisterModule', canActivate: [AuthGuard] },
  { path: 'eventos', loadChildren: '../app/modules/events/events.module#EventsModule', canActivate: [AuthGuard] },
  { path: 'configuracoes', loadChildren: '../app/modules/settings/settings.module#SettingsModule', canActivate: [AuthGuard] },

  { path: 'recuperar-senha', component: ForgotComponent, canActivate: [AuthRouteService] },
  { path: '', component: LoginComponent, canActivate: [AuthRouteService] },
  { path: ':id', component: SubscriptionListComponent },
  { path: ':id/:id', component: SubscriptionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
