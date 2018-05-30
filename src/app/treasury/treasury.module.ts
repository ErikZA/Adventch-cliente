import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreasurersComponent } from './treasurers/treasurers.component';

import { TreasuryRoutingModule } from './treasury-routing.module';
import { TreasurersDataComponent } from './treasurers/components/treasurers-data/treasurers-data.component';
import { CoreModule } from '../core/core.module';
import { TreasurersFormComponent } from './treasurers/components/treasurers-form/treasurers-form.component';
import { TreasuryService } from './treasury.service';
import { DataTableComponent } from '../core/components/data-table/data-table.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TreasuryRoutingModule
  ],
  declarations: [
    TreasurersComponent,
    TreasurersDataComponent,
    TreasurersFormComponent,
  ],
  providers:[
    TreasuryService,
    DataTableComponent
  ]
})
export class TreasuryModule { }
