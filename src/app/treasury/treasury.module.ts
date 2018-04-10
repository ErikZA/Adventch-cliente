import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreasurersComponent } from './treasurers/treasurers.component';

import { TreasuryRoutingModule } from './treasury-routing.module';
import { TreasurersDataComponent } from './treasurers-data/treasurers-data.component';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TreasuryRoutingModule
  ],
  declarations: [TreasurersComponent, TreasurersDataComponent]
})
export class TreasuryModule { }