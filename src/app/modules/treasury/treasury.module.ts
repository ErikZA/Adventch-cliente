import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreasuryService } from './treasury.service';
import { TreasurerStore } from './components/treasurer/treasurer.store';

import { CoreModule } from '../../core/core.module';

import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';

import { TreasuryRoutingModule } from './treasury-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TreasuryRoutingModule
  ],
  declarations: [
    TreasurerDataComponent,
    TreasurerFormComponent,
  ],
  providers: [
    TreasuryService,
    TreasurerStore
  ]
})
export class TreasuryModule { }
