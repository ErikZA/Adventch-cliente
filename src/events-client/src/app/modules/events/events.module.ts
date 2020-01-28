import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventListComponent } from './event-list/event-list.component';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    EventListComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule
  ],
})
export class EventsModule { }
