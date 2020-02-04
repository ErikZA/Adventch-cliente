import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventsRoutingModule } from './events-routing.module';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';

import { SharedModule } from '../shared/shared.module';
import { EventFormComponent } from './event-form/event-form.component';


@NgModule({
  declarations: [
    EventListComponent,
    EventDetailsComponent,
    EventFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule
  ]
})
export class EventsModule { }
