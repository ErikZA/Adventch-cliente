import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ScholarshipComponent } from './components/process/scholarship.component';
import { ProcessFormComponent } from './components/process/process-form/process-form.component';
import { ProcessDataComponent } from './components/process/process-data/process-data.component';
import { EFeatures } from '../../shared/models/EFeatures.enum';
import { EPermissions } from '../../shared/models/permissions.enum';
import { FeatureGuard } from '../../shared/guards/feature.guard';

const routes: Routes = [
  {
    path: 'dashboard',
    component: ScholarshipComponent,
    canActivate: [FeatureGuard],
    canLoad: [FeatureGuard],
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
            path: ':id/editar',
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
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScholarshipRoutingModule { }
