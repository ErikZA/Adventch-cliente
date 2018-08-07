import { RedefinePasswordComponent } from './shared/redefine-password/redefine-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// core
import { LayoutComponent } from './shared/layout/layout.component';

import { AuthGuard } from './shared/auth.guard';
import { AdminGuard } from './shared/admin.guard';
import { ModuleGuard } from './shared/module.guard';
import { RedefinePasswordGuard } from './shared/redefine-password/redefine-password.guard';

// shared
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { ReleaseNotesDataComponent } from './shared/release-notes/components/release-notes-data/release-notes-data.component';
import { ScholarshipModule } from './modules/scholarship/scholarship.module';
import { ReleaseNotesFormComponent } from './shared/release-notes/components/release-notes-form/release-notes-form.component';
import { EditUserComponent } from './shared/profile/edit-user/edit-user.component';
import { ChangePasswordComponent } from './shared/change-password/change-password.component';

import { EModules } from './shared/models/modules.enum';
import { AuthModule } from './auth/auth.module';
import { AuthMainGuard } from './shared/guards/auth-main.guard';

// components
// import { BonificationTypesComponent } from 'app/bonification/bonification-types/bonification-types/bonification-types.component';
// import { BonificationTypesDataComponent }
// from 'app/bonification/bonification-types/bonification-types-data/bonification-types-data.component';

const appRoutes: Routes = [
  { path: '', component: LayoutComponent, canActivate: [AuthMainGuard], canLoad: [AuthMainGuard], children: [
    { path: '', component: DashboardComponent },
    { path: 'perfil/editar', component: EditUserComponent },
    { path: 'alterar-senha', component: ChangePasswordComponent },
    { path: 'notas-da-versao', component: ReleaseNotesDataComponent, children: [
      { path: 'novo', component: ReleaseNotesFormComponent }
    ]}
  ]},
  // { path: '', loadChildren: '../app/auth/auth.module#AuthModule' },
  {
    path: '', loadChildren: '../app/modules/scholarship/scholarship.module#ScholarshipModule',
    // canActivate: [AuthMainGuard],
    // canLoad: [AuthMainGuard],
    // data: {
      //   module: EModules.Scholarship
      // }
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
    path: 'administracao',
    canActivate: [AuthMainGuard, AdminGuard],
    canLoad: [AuthMainGuard, AdminGuard],
    loadChildren: '../app/modules/administration/administration.module#AdministrationModule'
  },
  // { path: 'login', component: LoginComponent },
  { path: 'resetar-senha/:recover_pass', component: RedefinePasswordComponent },
  { path: '**', component: PageNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: false, preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRouting { }
