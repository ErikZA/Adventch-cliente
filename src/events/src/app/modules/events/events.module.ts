import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { EventListComponent } from './event-list/event-list.component';
import { EventsRoutingModule } from './events-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpRequestInterceptor } from 'src/app/shared/http-interceptor';

@NgModule({
  declarations: [
    EventListComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  ]
})
export class EventsModule { }
