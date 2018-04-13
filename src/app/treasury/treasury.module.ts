import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreasurersComponent } from './treasurers/treasurers.component';

import { TreasuryRoutingModule } from './treasury-routing.module';
import { TreasurersDataComponent } from './treasurers/components/treasurers-data/treasurers-data.component';
import { CoreModule } from '../core/core.module';
import { TreasurersFormComponent } from './treasurers/components/treasurers-form/treasurers-form.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TreasuryRoutingModule
  ],
  declarations: [
    TreasurersComponent,
    TreasurersDataComponent,
    TreasurersFormComponent
  ]
})
export class TreasuryModule { }
