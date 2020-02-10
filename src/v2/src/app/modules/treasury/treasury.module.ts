import { Avaliation } from './models/avaliation';
import { Observation } from './models/observation';
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
import { RequirementDataComponent } from './components/requirements/requirements-data/requirements-data.component';
import { RequirementFormComponent } from './components/requirements/requirements-form/requirements-form.component';
import { RequirementStore } from './components/requirements/requirements.store';
import { AvaliationDataComponent } from './components/avaliation/avaliation-data/avaliation-data.component';
import { AvaliationFormComponent } from './components/avaliation/form/avaliation-form/avaliation-form.component';
import { AvaliationStore } from './components/avaliation/avaliation.store';
import { AvaliationReportComponent } from './components/dashboard/avaliation-report/avaliation-report-component';
import { RequirementsService } from './components/requirements/requirements.service';
import { AvaliationService } from './components/avaliation/avaliation.service';
import {
  AvaliationRequirementFormComponent
} from './components/avaliation/form/avaliation-requirement-form/avaliation-requirement-form.component';
import { ObservationsInformationComponent } from './components/avaliation/form/observations-information/observations-information.component';
import { ChurchService } from './components/church/church.service';
import { ObservationService } from './components/observation/observation.service';
import { TreasurerService } from './components/treasurer/treasurer.service';
import { DistrictService } from './components/districts/district.service';
import { CardCountFeaturesComponent } from './components/dashboard/card-count-features/card-count-features.component';
import { DashboardTreasuryService } from './components/dashboard/dashboard-treasury.service';
import { AvaliationObservationFormComponent } from './components/avaliation/form/avaliation-observation-form/avaliation-observation-form.component';


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
    AvaliationDataComponent,
    AvaliationReportComponent,
    AvaliationFormComponent,
    AvaliationRequirementFormComponent,
    ObservationsInformationComponent,
    CardCountFeaturesComponent,
    AvaliationObservationFormComponent
  ],
  providers: [
    TreasuryService,
    ModuleGuard,
    FeatureGuard,
    RequirementStore,
    RequirementsService,
    AvaliationService,
    ChurchService,
    ObservationService,
    TreasurerService,
    DistrictService,
    AvaliationStore,
    DashboardTreasuryService,
    ObservationDataComponent
  ],
  entryComponents: [
    AvaliationReportComponent
  ]
})
export class TreasuryModule { }
