import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EFeatures } from '../../shared/models/EFeatures.enum';
import { EPermissions } from '../../shared/models/permissions.enum';
import { FeatureGuard } from '../../shared/guards/feature.guard';
import { BudgetDataComponent } from './components/budget/budget-data/budget-data.component';

const routes: Routes = [
  {
    path: 'orcamentos', component: BudgetDataComponent,
    canActivate: [FeatureGuard],
    canLoad: [FeatureGuard],
    /*children: [
          {
            path: 'novo',
            component: ProcessFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.Processos,
              permission: EPermissions.CRIAR
            }
          },
          {
            path: ':id/editar',
            component: ProcessFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.Processos,
              permission: EPermissions.EDITAR
            }
          }
      ],*/
    data: {
      feature: EFeatures.Orcamentos,
      permission: EPermissions.VISUALISAR
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
