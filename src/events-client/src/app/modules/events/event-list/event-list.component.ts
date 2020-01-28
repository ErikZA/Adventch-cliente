import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { EventModel } from 'src/app/models/event.model';
import { ReadEvents } from 'src/app/actions/event.action';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  public events: EventModel[];
  public event$: Observable<any>;

  constructor(
    public store: Store<any>
  ) {
    this.event$ = store.select('event')
    this.store.dispatch(ReadEvents());
  }

  ngOnInit() {
    this.event$.subscribe((res) => this.events = res);
  }

}
