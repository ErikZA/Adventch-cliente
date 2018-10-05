import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponsibleRoutingModule } from './responsible-routing.module';
import { StudentProcessDataComponent } from './components/student-process-data/student-process-data.component';
import { CoreModule } from '../../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    ResponsibleRoutingModule
  ],
  declarations: [
    StudentProcessDataComponent
  ]
})
export class ResponsibleModule { }
