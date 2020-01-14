import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailsComponent } from './event-details/event-details.component';
import { EventFormComponent } from './event-form/event-form.component';


const routes: Routes = [
  { path: 'new', component: EventFormComponent },
  { path: ':name', component: EventDetailsComponent },
  { path: 'edit/:identifier', component: EventFormComponent },
  { path: '', component: EventListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
