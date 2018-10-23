import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsibleRoutingModule } from './responsible-routing.module';
import { StudentProcessDataComponent } from './components/student-process-data/student-process-data.component';
import { CoreModule } from '../../../core/core.module';
import { StudentProcessDataPendencyComponent } from './components/student-process-data-pendency/student-process-data-pendency.component';
import {
  StudentProcessDataPendencyFileComponent
} from './components/student-process-data-pendency-file/student-process-data-pendency-file.component';
import { ResponsibleService } from '../responsible/responsible.service';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ResponsibleRoutingModule
  ],
  providers: [
    ResponsibleService,
  ],
  declarations: [
    StudentProcessDataComponent,
    StudentProcessDataPendencyComponent,
    StudentProcessDataPendencyFileComponent
  ]
})
export class ResponsibleModule { }
