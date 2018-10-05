import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';

import { ScholarshipRoutingModule } from './scholarship-routing.module';
import { ModuleGuard } from '../../shared/guards/module.guard';

import { MatGridListModule } from '@angular/material';

import { ScholarshipComponent } from './components/process/scholarship.component';
import { ProcessFormComponent } from './components/process/process-form/process-form.component';
import { ProcessDataComponent } from './components/process/process-data/process-data.component';
import { ResponsibleDataComponent } from './components/responsible/responsible-data/responsible-data.component';
import { PendencyComponent } from './components/process/pendency/pendency.component';
import { VacancyComponent } from './components/process/vacancy/vacancy.component';

import { ScholarshipService } from './scholarship.service';
import { ProcessFormDocumentInfoComponent } from './components/process/process-form-document-info/process-form-document-info.component';
import { ProcessDataDocumentInfoComponent } from './components/process/process-data-document-info/process-data-document-info.component';
import { ProcessCardCountComponent } from './components/process/process-card-count/process-card-count.component';
import { FeatureGuard } from '../../shared/guards/feature.guard';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatGridListModule,
    ScholarshipRoutingModule
  ],
  providers: [
    ScholarshipService,
    ModuleGuard,
    FeatureGuard
  ],
  declarations: [
    ScholarshipComponent,
    ProcessDataComponent,
    ProcessFormComponent,
    PendencyComponent,
    VacancyComponent,
    ResponsibleDataComponent,
    ProcessFormDocumentInfoComponent,
    ProcessDataDocumentInfoComponent,
    ProcessCardCountComponent
  ],
  entryComponents: [
    PendencyComponent,
    VacancyComponent
  ]
})
export class ScholarshipModule { }
