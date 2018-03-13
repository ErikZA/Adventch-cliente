import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// core
import { LayoutComponent } from '../shared/layout/layout.component';

import { AuthGuard } from '../shared/auth.guard';

// shared
import { DashboardComponent } from '../shared/dashboard/dashboard.component';
import { EmptyPageComponent } from '../shared/empty-page/empty-page.component';
import { PageNotFoundComponent } from '../shared/page-not-found/page-not-found.component';

// components
// import { BonificationTypesComponent } from 'app/bonification/bonification-types/bonification-types/bonification-types.component';
// import { BonificationTypesDataComponent } from 'app/bonification/bonification-types/bonification-types-data/bonification-types-data.component';

const routes: Routes = [
   { path: 'payment', component: LayoutComponent, canActivate: [AuthGuard], canLoad: [AuthGuard], children: [
      { path: '', component: DashboardComponent }]},
  // otherwise redirect to home
//   { path: '', redirectTo: 'payment', pathMatch: 'full' },
//   { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
