import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreasuryService } from './treasury.service';

import { CoreModule } from '../../core/core.module';

import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';

import { TreasuryRoutingModule } from './treasury-routing.module';
import { ModuleGuard } from '../../shared/guards/module.guard';
import { ChurchDataComponent } from './components/church/church-data/church-data.component';
import { ChurchFormComponent } from './components/church/church-form/church-form.component';
import { DistrictsDataComponent } from './components/districts/districts-data/districts-data.component';
import { DistrictsFormComponent } from './components/districts/districts-form/districts-form.component';
import { ObservationDataComponent } from './components/observation/observation-data/observation-data.component';
import { ObservationFormComponent } from './components/observation/observation-form/observation-form.component';
import { DashboardTreasuryComponent } from './components/dashboard/dashboard-treasury-component';
import { ChartsModule } from 'ng2-charts';
import { FeatureGuard } from '../../shared/guards/feature.guard';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TreasuryRoutingModule,
    CommonModule,
    CoreModule,
    ChartsModule
  ],
  declarations: [
    TreasurerDataComponent,
    TreasurerFormComponent,
    ChurchDataComponent,
    ChurchFormComponent,
    DistrictsDataComponent,
    DistrictsFormComponent,
    ObservationDataComponent,
    ObservationFormComponent,
    DashboardTreasuryComponent
  ],
  providers: [
    TreasuryService,
    ModuleGuard,
    FeatureGuard,
  ]
})
export class TreasuryModule { }
