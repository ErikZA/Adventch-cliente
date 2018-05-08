import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { ScholarshipComponent } from './components/scholarship.component';
import { ScholarshipRoutingModule } from './scholarship-routing.module';
import { MatCardModule, MatGridListModule } from '@angular/material';
import { ScholarshipService } from './scholarship.service';
import { ProcessDataComponent } from './components/process-data/process-data.component';

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
  declarations: [ScholarshipComponent, ProcessDataComponent]
})
export class ScholarshipModule { }
