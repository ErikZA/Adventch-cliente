import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../../shared/layout/layout.component';

import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';
import { ChurchDataComponent } from './components/church/church-data/church-data.component';
import { ChurchFormComponent } from './components/church/church-form/church-form.component';
import { DistrictsDataComponent } from './components/districts/districts-data/districts-data.component';
import { DistrictsFormComponent } from './components/districts/districts-form/districts-form.component';
import { ObservationDataComponent } from './components/observation/observation-data/observation-data.component';
import { ObservationFormComponent } from './components/observation/observation-form/observation-form.component';
import { DashboardTreasuryComponent } from './components/dashboard/dashboard-treasury-component';

import { FeatureGuard } from '../../shared/feature.guard';
import { EFeatures } from '../../shared/models/EFeatures.enum';
import { EPermissions } from '../../shared/models/permissions.enum';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  {
    path: 'tesoureiros', component: LayoutComponent, children: [
      {
        path: '', component: TreasurerDataComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], children: [
          {
            path: 'novo', component: TreasurerFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.TESOUREIRO,
              permission: EPermissions.CRIAR
            }
          },
          {
            path: 'editar', component: TreasurerFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.TESOUREIRO,
              permission: EPermissions.EDITAR
            }
          }
        ],
        data: {
          feature: EFeatures.TESOUREIRO,
          permission: EPermissions.VISUALISAR
        }
      },
    ],
  },
  {
    path: 'igrejas', component: LayoutComponent, children: [
      { path: '', component: ChurchDataComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], children: [
        { path: 'novo', component: ChurchFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.IGREJAS,
          permission: EPermissions.CRIAR
        } },
        { path: ':id/editar', component: ChurchFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.IGREJAS,
          permission: EPermissions.EDITAR
        } }
        ],
        data: {
          feature: EFeatures.IGREJAS
        }
      }
    ]
  },
  {
    path: 'distritos', component: LayoutComponent, children: [
      { path: '', component: DistrictsDataComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], children: [
        { path: 'novo', component: DistrictsFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.DISTRITOS,
          permission: EPermissions.CRIAR
        } },
        { path: ':id/editar', component: DistrictsFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.DISTRITOS,
          permission: EPermissions.EDITAR
        } }
      ],
      data: {
        feature: EFeatures.DISTRITOS
      }
    }]
  },
  {
    path: 'observacoes', component: LayoutComponent, children: [
      { path: '', component: ObservationDataComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], children: [
        { path: 'novo', component: ObservationFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.OBSERVACOES,
          permission: EPermissions.CRIAR
        } },
        { path: ':id/editar', component: ObservationFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.OBSERVACOES,
          permission: EPermissions.EDITAR
        } }
      ],
      data: {
        feature: EFeatures.OBSERVACOES
      }
    }]
  },
  {
    path: 'dashboard', component: LayoutComponent, children: [
      { path: '', component: DashboardTreasuryComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
        feature: EFeatures.DASHBOARDTESOURARIA
      } }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryRoutingModule { }
