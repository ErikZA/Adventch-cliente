import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {

  public association: string;
  public events: any;

  constructor(
    public router: ActivatedRoute,
    private _subscription: SubscriptionService,
  ) { }

  ngOnInit() {

    this.router.params.subscribe((res: any) => {
      this.association = res.id
      this._subscription.AllEvents(res.id).subscribe((res: any) => {
        this.events = res.data[0].events;
      });
    });

  }

}
