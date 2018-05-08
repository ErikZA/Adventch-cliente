import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';

import { ScholarshipComponent } from './components/scholarship.component';
import { ScholarshipRoutingModule } from './scholarship-routing.module';
import { MatCardModule, MatGridListModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    MatGridListModule ,
    ScholarshipRoutingModule
  ],
  declarations: [ScholarshipComponent]
})
export class ScholarshipModule { }
