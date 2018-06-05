import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreasurerComponent } from './components/treasurer/treasurer.component';

import { TreasuryRoutingModule } from './treasury-routing.module';
import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { CoreModule } from '../core/core.module';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';
import { TreasuryService } from './treasury.service';
import { DataTableComponent } from '../core/components/data-table/data-table.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TreasuryRoutingModule
  ],
  declarations: [
    TreasurerComponent,
    TreasurerDataComponent,
    TreasurerFormComponent,
  ],
  providers: [
    TreasuryService,
    DataTableComponent
  ]
})
export class TreasuryModule { }