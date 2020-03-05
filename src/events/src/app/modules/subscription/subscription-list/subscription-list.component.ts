import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../subscription.service';
import { Store } from '@ngrx/store';
import { Sidebar } from 'src/app/actions/sidebar.action';
import { loaded } from 'src/app/actions/loading.action';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {

  public association: string;
  public events: any;
  public isInvalidAliasName = false;

  constructor(
    public router: ActivatedRoute,
    private _subscription: SubscriptionService,
    private store: Store<any>,
  ) {
    this.store.dispatch(loaded(false));
  }

  ngOnInit() {
    this.router.params.subscribe((res: any) => {
      this.association = res.id
      this._subscription.AllEvents(res.id).then((res: any) => {
        this.events = res.data[0].events;
      }).catch(err => {
        if (err.totalRows === 0) this.isInvalidAliasName = true;
      }).finally(() => this.store.dispatch(loaded(true)));
    });
  }

}
