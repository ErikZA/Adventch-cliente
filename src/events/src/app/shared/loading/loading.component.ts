import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  public loaded$: Observable<any>;
  public open: boolean;

  constructor(
    private store: Store<any>,
  ) {
    this.loaded$ = store.select('loaded')
  }

  ngOnInit() {
    this.loaded$.subscribe(res => this.open = res);
  }

}
