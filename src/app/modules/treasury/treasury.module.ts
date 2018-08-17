import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreasuryService } from './treasury.service';
import { TreasurerStore } from './components/treasurer/treasurer.store';

import { CoreModule } from '../../core/core.module';

import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';

import { TreasuryRoutingModule } from './treasury-routing.module';
import { ModuleGuard } from '../../shared/module.guard';
import { FeatureGuard } from '../../shared/feature.guard';
import { ChurchDataComponent } from './components/church/church-data/church-data.component';
import { ChurchFormComponent } from './components/church/church-form/church-form.component';
import { ChurchStore } from './components/church/church.store';
import { DistrictsDataComponent } from './components/districts/districts-data/districts-data.component';
import { DistrictsFormComponent } from './components/districts/districts-form/districts-form.component';
import { DistrictsStore } from './components/districts/districts.store';
import { ObservationDataComponent } from './components/observation/observation-data/observation-data.component';
import { ObservationFormComponent } from './components/observation/observation-form/observation-form.component';
import { ObservationStore } from './components/observation/observation.store';
import { DashboardTreasuryComponent } from './components/dashboard/dashboard-treasury-component';
import { ChartsModule } from 'ng2-charts';
import { RequirementDataComponent } from './components/requirements/requirements-data/requirements-data.component';
import { RequirementFormComponent } from './components/requirements/requirements-form/requirements-form.component';
import { RequirementStore } from './components/requirements/requirements.store';

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
    DashboardTreasuryComponent,
    RequirementDataComponent,
    RequirementFormComponent,
  ],
  providers: [
    TreasuryService,
    TreasurerStore,
    ModuleGuard,
    FeatureGuard,
    ChurchStore,
    DistrictsStore,
    ObservationStore,
    RequirementStore
  ]
})
export class TreasuryModule { }
