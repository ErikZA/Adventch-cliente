import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TreasuryService } from './treasury.service';
import { TreasurerStore } from './components/treasurer/treasurer.store';

import { CoreModule } from '../../core/core.module';

import { TreasurerDataComponent } from './components/treasurer/treasurer-data/treasurer-data.component';
import { TreasurerFormComponent } from './components/treasurer/treasurer-form/treasurer-form.component';

import { TreasuryRoutingModule } from './treasury-routing.module';
import { ChurchDataComponent } from './components/church/church-data/church-data.component';
import { ChurchFormComponent } from './components/church/church-form/church-form.component';
import { ChurchStore } from './components/church/church.store';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TreasuryRoutingModule
  ],
  declarations: [
    TreasurerDataComponent,
    TreasurerFormComponent,
    ChurchDataComponent,
    ChurchFormComponent,
  ],
  providers: [
    TreasuryService,
    TreasurerStore,
    ChurchStore
  ]
})
export class TreasuryModule { }
