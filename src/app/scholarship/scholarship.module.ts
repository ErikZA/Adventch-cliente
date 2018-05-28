import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { ScholarshipComponent } from './components/scholarship.component';
import { ScholarshipRoutingModule } from './scholarship-routing.module';
import { MatCardModule, MatGridListModule } from '@angular/material';
import { ScholarshipService } from './scholarship.service';
import { ProcessFormComponent } from './components/process-form/process-form.component';
import { ProcessDataComponent } from './components/process-data/process-data.component';
import { PendencyComponent } from './components/pendency/pendency.component';
import { VacancyComponent } from './components/vacancy/vacancy.component';
import { ResponsibleDataComponent } from './components/responsible/responsible-data/responsible-data.component';
import { ResponsibleLoginComponent } from './components/responsible/responsible-login/responsible-login.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatGridListModule,
    ScholarshipRoutingModule
  ],
  providers:[
    ScholarshipService
  ],
  declarations: [
    ScholarshipComponent,
    ProcessDataComponent,
    ProcessFormComponent,
    PendencyComponent,
    VacancyComponent,
    ResponsibleLoginComponent,
    ResponsibleDataComponent
  ],
  entryComponents: [
    PendencyComponent,
    VacancyComponent
  ]
})
export class ScholarshipModule { }
