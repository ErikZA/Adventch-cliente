import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutComponent } from '../../shared/layout/layout.component';
import { ScholarshipComponent } from './components/process/scholarship.component';
import { ProcessFormComponent } from './components/process/process-form/process-form.component';
import { ProcessDataComponent } from './components/process/process-data/process-data.component';
import { ResponsibleDataComponent } from './components/responsible/responsible-data/responsible-data.component';

import { EModules } from '../../shared/models/modules.enum';
import { ModuleGuard } from '../../shared/guards/module.guard';
import { AuthResponsibleGuard } from '../../shared/guards/auth-responsible.guard';
import { AuthMainGuard } from '../../shared/guards/auth-main.guard';
import { EFeatures } from '../../shared/models/EFeatures.enum';
import { EPermissions } from '../../shared/models/permissions.enum';
import { FeatureGuard } from '../../shared/guards/feature.guard';

const routes: Routes = [
  {
    path: 'educacao/consultar',
    component: ResponsibleDataComponent,
    pathMatch: 'full',
    canActivate: [AuthResponsibleGuard],
    canLoad: [AuthResponsibleGuard]
  },
  {
    path: 'bolsas',
    component: LayoutComponent,
    canActivate: [AuthMainGuard, ModuleGuard],
    canLoad: [AuthMainGuard, ModuleGuard],
    children: [
      {
        path: 'dashboard', component: ScholarshipComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], children: [
          {
            path: 'novo',
            component: ProcessFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.PROCESSOS,
              permission: EPermissions.CRIAR
            }
          }
        ],
        data: {
          feature: EFeatures.DASHBOARDBOLSAS
        }
      },
      {
        path: 'processos', component: ProcessDataComponent,
        canActivate: [FeatureGuard],
        canLoad: [FeatureGuard],
        children: [
          {
            path: 'novo',
            component: ProcessFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.PROCESSOS,
              permission: EPermissions.CRIAR
            }
          },
          {
            path: ':identifyProcess/editar',
            component: ProcessFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.PROCESSOS,
              permission: EPermissions.EDITAR
            }
          }
        ],
        data: {
          feature: EFeatures.PROCESSOS,
          permission: EPermissions.VISUALISAR
        }
      }
    ],
    data: {
      module: EModules.Scholarship
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScholarshipRoutingModule { }
