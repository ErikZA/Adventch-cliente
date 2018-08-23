import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';

import { ScholarshipRoutingModule } from './scholarship-routing.module';
import { ModuleGuard } from '../../shared/module.guard';

import { MatGridListModule } from '@angular/material';

import { ScholarshipComponent } from './components/process/scholarship.component';
import { ProcessFormComponent } from './components/process/process-form/process-form.component';
import { ProcessDataComponent } from './components/process/process-data/process-data.component';
import { ResponsibleDataComponent } from './components/responsible/responsible-data/responsible-data.component';
import { ResponsibleLoginComponent } from './components/responsible/responsible-login/responsible-login.component';
import { PendencyComponent } from './components/process/pendency/pendency.component';
import { VacancyComponent } from './components/process/vacancy/vacancy.component';

import { ScholarshipService } from './scholarship.service';
import { ProcessesStore } from './components/process/processes.store';
import { FeatureGuard } from '../../shared/feature.guard';
import { ProcessFormDocumentInfoComponent } from './components/process/process-form-document-info/process-form-document-info.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatGridListModule,
    ScholarshipRoutingModule
  ],
  providers: [
    ScholarshipService,
    ProcessesStore,
    ModuleGuard,
    FeatureGuard
  ],
  declarations: [
    ScholarshipComponent,
    ProcessDataComponent,
    ProcessFormComponent,
    PendencyComponent,
    VacancyComponent,
    ResponsibleLoginComponent,
    ResponsibleDataComponent,
    ProcessFormDocumentInfoComponent
  ],
  entryComponents: [
    PendencyComponent,
    VacancyComponent
  ]
})
export class ScholarshipModule { }
