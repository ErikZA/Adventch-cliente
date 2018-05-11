import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { ScholarshipComponent } from './components/scholarship.component';
import { ScholarshipRoutingModule } from './scholarship-routing.module';
import { MatCardModule, MatGridListModule } from '@angular/material';
import { ScholarshipService } from './scholarship.service';
import { ProcessFormComponent } from './components/process-form/process-form.component';

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
  declarations: [ScholarshipComponent, ProcessFormComponent]
})
export class ScholarshipModule { }
