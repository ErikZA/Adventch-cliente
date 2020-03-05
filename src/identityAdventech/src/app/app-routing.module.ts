import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './modules/account/login/login.component';
import { ForgotComponent } from './modules/account/forgot/forgot.component';
import { HomeComponent } from './modules/home/home.component';
// Services
import { AuthRoute } from './shared/auth/authRoute.guard';
import { AuthGuard } from './shared/auth/auth.guard';
import { Oauth2Component } from './modules/account/oauth2/oauth2.component';
import { oauth2AuthRoute } from './shared/auth/oauth2authRoute.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthRoute] },
  { path: 'forgot', component: ForgotComponent, canActivate: [AuthRoute] },

  { path: 'oauth2/auth', component: Oauth2Component },
  // canActivate: [oauth2AuthRoute]
  // canActivate: [AuthRoute]
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
