import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// core
import { LayoutComponent } from './shared/layout/layout.component';

// shared
import { LoginComponent } from './shared/login/login.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { EmptyPageComponent } from './shared/empty-page/empty-page.component';
import { AuthGuard } from './shared/auth.guard';

// components
// import { BonificationTypesComponent } from 'app/bonification/bonification-types/bonification-types/bonification-types.component';
// import { BonificationTypesDataComponent } from 'app/bonification/bonification-types/bonification-types-data/bonification-types-data.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
      { path: 'dashboard', component: DashboardComponent },
      /*{
        path: 'tipos-de-bonificacao', component: BonificationTypesComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
          { path: 'novo', component: BonificationTypesDataComponent },
          { path: ':id/:name', component: BonificationTypesDataComponent }
        ]
      }*/,
    ]
  },
  // otherwise redirect to home
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRouting { }
