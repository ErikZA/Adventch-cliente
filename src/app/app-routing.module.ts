import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// core
import { LayoutComponent } from './shared/layout/layout.component';

import { AuthGuard } from './shared/auth.guard';

// shared
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { EmptyPageComponent } from './shared/empty-page/empty-page.component';
import { LoginComponent } from './shared/login/login.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';

// components
// import { BonificationTypesComponent } from 'app/bonification/bonification-types/bonification-types/bonification-types.component';
// import { BonificationTypesDataComponent } from 'app/bonification/bonification-types/bonification-types-data/bonification-types-data.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'treasury', redirectTo: 'treasury', pathMatch: 'full' },
  { path: 'payment', redirectTo: 'payment', pathMatch: 'full' },
  { path: '', redirectTo: 'treasury', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRouting { }
