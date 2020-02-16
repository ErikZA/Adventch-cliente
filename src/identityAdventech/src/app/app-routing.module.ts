import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { LoginComponent } from './modules/account/login/login.component';
import { ForgotComponent } from './modules/account/forgot/forgot.component';
import { HomeComponent } from './modules/home/home.component';
// Services
import { AuthRoute } from './shared/auth/authRoute.guard';
import { AuthGuard } from './shared/auth/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthRoute] },
  { path: 'forgot', component: ForgotComponent, canActivate: [AuthRoute] },
  // canActivate: [AuthRoute]
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
