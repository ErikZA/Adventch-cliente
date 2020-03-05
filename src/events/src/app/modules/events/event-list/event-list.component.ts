import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { EventModel } from 'src/app/models/event.model';
import { EventRegisterService } from '../event-register/event-register.service';
import { loaded } from 'src/app/actions/loading.action';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  public event$: Observable<any>;
  public events: EventModel[];

  constructor(
    public store: Store<any>,
    private service: EventRegisterService,
  ) {
    this.event$ = store.select('event')
    store.dispatch(loaded(true));
  }

  ngOnInit() {
    this.service.All();
    this.event$.subscribe(res => {
      this.events = res
      console.log(res);
    })
  }

  remove(id: string) {
    this.service.Remove(id);
  }

}
