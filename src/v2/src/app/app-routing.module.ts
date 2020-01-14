import { RedefinePasswordComponent } from './shared/redefine-password/redefine-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// core
import { LayoutMainComponent } from './core/components/container/layout-main/layout-main.component';
import { AdminGuard } from './shared/guards/admin.guard';
import { ModuleGuard } from './shared/guards/module.guard';

// shared
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ReleaseNotesDataComponent } from './shared/release-notes/components/release-notes-data/release-notes-data.component';
import { ReleaseNotesFormComponent } from './shared/release-notes/components/release-notes-form/release-notes-form.component';
import { EditUserComponent } from './shared/profile/edit-user/edit-user.component';
import { ChangePasswordComponent } from './shared/change-password/change-password.component';

import { EModules } from './shared/models/modules.enum';
import { AuthMainGuard } from './shared/guards/auth-main.guard';
import { AuthResponsibleGuard } from './shared/guards/auth-responsible.guard';
import { LayoutResponsibleComponent } from './core/components/container/layout-responsible/layout-responsible.component';

const appRoutes: Routes = [
  { path: '', component: LayoutMainComponent, canActivate: [AuthMainGuard], canLoad: [AuthMainGuard], children: [
    { path: '', component: DashboardComponent },
    { path: 'perfil/editar', component: EditUserComponent },
    { path: 'alterar-senha', component: ChangePasswordComponent },
    { path: 'notas-da-versao', component: ReleaseNotesDataComponent, children: [
      { path: 'novo', component: ReleaseNotesFormComponent }
    ]},
    {
      path: 'bolsas', loadChildren: '../app/modules/scholarship/scholarship.module#ScholarshipModule',
      canActivate: [AuthMainGuard, ModuleGuard],
      canLoad: [AuthMainGuard, ModuleGuard],
      data: {
        module: EModules.Scholarship
      }
    },
    {
      path: 'tesouraria',
      loadChildren: '../app/modules/treasury/treasury.module#TreasuryModule',
      canActivate: [AuthMainGuard, ModuleGuard],
      canLoad: [AuthMainGuard, ModuleGuard],
      data: {
        module: EModules.Treasury
      },
    },
    {
      path: 'pagamentos',
      loadChildren: '../app/modules/payment/payment.module#PaymentModule',
      canActivate: [AuthMainGuard, ModuleGuard],
      canLoad: [AuthMainGuard, ModuleGuard],
      data: {
        module: EModules.Payment
      },
    },
    {
      path: 'administracao',
      canActivate: [AuthMainGuard, AdminGuard],
      canLoad: [AuthMainGuard, AdminGuard],
      loadChildren: '../app/modules/administration/administration.module#AdministrationModule'
    }
  ]},
  { path: 'educacao',
    component: LayoutResponsibleComponent,
    canActivate: [AuthResponsibleGuard],
    canLoad: [AuthResponsibleGuard],
    children: [
      {
        path: '',
        loadChildren: '../app/modules/scholarship/responsible/responsible.module#ResponsibleModule',
      },
  ]},
  { path: 'resetar-senha/:recover_pass', component: RedefinePasswordComponent },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: false, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRouting { }
