import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventRegisterComponent } from './event-register/event-register.component';

const routes: Routes = [
  {
    path: '',
    component: EventRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventRegisterRoutingModule { }
