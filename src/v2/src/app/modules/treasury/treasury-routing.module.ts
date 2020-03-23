import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';
import { ChurchDataComponent } from './components/church/church-data/church-data.component';
import { ChurchFormComponent } from './components/church/church-form/church-form.component';
import { DistrictsDataComponent } from './components/districts/districts-data/districts-data.component';
import { DistrictsFormComponent } from './components/districts/districts-form/districts-form.component';
import { ObservationDataComponent } from './components/observation/observation-data/observation-data.component';
import { ObservationFormComponent } from './components/observation/observation-form/observation-form.component';
import { DashboardTreasuryComponent } from './components/dashboard/dashboard-treasury-component';
import { AvaliationDataComponent } from './components/avaliation/avaliation-data/avaliation-data.component';
import { AvaliationFormComponent } from './components/avaliation/form/avaliation-form/avaliation-form.component';

import { EFeatures } from '../../shared/models/EFeatures.enum';
import { EPermissions } from '../../shared/models/permissions.enum';
import { FeatureGuard } from '../../shared/guards/feature.guard';
import { RequirementDataComponent } from './components/requirements/requirements-data/requirements-data.component';
import { RequirementFormComponent } from './components/requirements/requirements-form/requirements-form.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard' },
  {
    path: 'tesoureiros', children: [
      {
        path: '',
        component: TreasurerDataComponent,
        canActivate: [FeatureGuard],
        canLoad: [FeatureGuard],
        children: [
          {
            path: 'novo', component: TreasurerFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.Tesoureiro,
              permission: EPermissions.CRIAR
            }
          },
          {
            path: ':id/editar', component: TreasurerFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.Tesoureiro,
              permission: EPermissions.EDITAR
            }
          }
        ],
        data: {
          feature: EFeatures.Tesoureiro,
          permission: EPermissions.VISUALISAR
        }
      },
    ],
  },
  {
    path: 'igrejas', children: [
      { path: '', component: ChurchDataComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], children: [
        { path: 'novo', component: ChurchFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.Igrejas,
          permission: EPermissions.CRIAR
        } },
        { path: ':id/editar', component: ChurchFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.Igrejas,
          permission: EPermissions.EDITAR
        } }
        ],
        data: {
          feature: EFeatures.Igrejas,
          permission: EPermissions.VISUALISAR
        }
      }
    ]
  },
  {
    path: 'distritos', children: [
      { path: '', component: DistrictsDataComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], children: [
        { path: 'novo', component: DistrictsFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.Distritos,
          permission: EPermissions.CRIAR
        } },
        { path: ':id/editar', component: DistrictsFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.Distritos,
          permission: EPermissions.EDITAR
        } }
      ],
      data: {
        feature: EFeatures.Distritos,
        permission: EPermissions.VISUALISAR
      }
    }]
  },
  {
    path: 'observacoes', children: [
      { path: '', component: ObservationDataComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], children: [
        { path: 'novo', component: ObservationFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.Observacoes,
          permission: EPermissions.CRIAR
        } },
        { path: ':id/editar', component: ObservationFormComponent, canActivate: [FeatureGuard], canLoad: [FeatureGuard], data: {
          feature: EFeatures.Observacoes,
          permission: EPermissions.EDITAR
        } }
      ],
      data: {
        feature: EFeatures.Observacoes,
        permission: EPermissions.VISUALISAR
      }
    }]
  },
  {
    path: 'avaliacoes', children: [
      {
        path: '',
        component: AvaliationDataComponent,
        canActivate: [FeatureGuard],
        canLoad: [FeatureGuard],
        children: [
          {
            path: ':id/mensal/novo',
            component: AvaliationFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.AvaliarMensalmente
            }
          },
          {
            path: ':id/mensal/:idAvaliation/editar',
            component: AvaliationFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.AvaliarMensalmente
            }
          },
          {
            path: ':id/semanal/novo',
            component: AvaliationFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.AvaliarSemanalmente
            }
          },
          {
            path: ':id/semanal/:idAvaliation/editar',
            component: AvaliationFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.AvaliarSemanalmente
            }
          },
          {
            path: ':id/anual/novo',
            component: AvaliationFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.AvaliarAnualmente
            }
          },
          {
            path: ':id/anual/:idAvaliation/editar',
            component: AvaliationFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.AvaliarAnualmente
            }
          }
      ],
      data: {
        feature: EFeatures.ListarAvaliacoes
      }
    }]
  },
  {
    path: 'dashboard', children: [
      {
        path: '',
        component: DashboardTreasuryComponent,
        canActivate: [FeatureGuard],
        canLoad: [FeatureGuard],
        data: {
          feature: EFeatures.DashboardTesouraria
        }
      }
    ]
  },
  {
    path: 'requisitos', children: [
      {
        path: '',
        component: RequirementDataComponent,
        canActivate: [FeatureGuard],
        canLoad: [FeatureGuard],
        children:
        [
          {
            path: 'novo',
            component: RequirementFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.Requisitos,
              permission: EPermissions.CRIAR
            }
          },
          {
            path: ':id/editar',
            component: RequirementFormComponent,
            canActivate: [FeatureGuard],
            canLoad: [FeatureGuard],
            data: {
              feature: EFeatures.Requisitos,
              permission: EPermissions.EDITAR
            }
          }
        ],
        data: {
          feature: EFeatures.Requisitos
        }
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TreasuryRoutingModule { }
