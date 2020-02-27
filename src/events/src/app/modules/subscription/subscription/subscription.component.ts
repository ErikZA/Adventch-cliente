import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../subscription.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public nameEvent: string;
  public products;
  public event: Event;

  constructor(
    public router: ActivatedRoute,
    private _subscription: SubscriptionService,
  ) { }

  ngOnInit() {
    this.router.params.subscribe((res: any) => {
      this.nameEvent = res.id
      this._subscription.OneEvent(res.id).subscribe((res: any) => {
        const { events } = res.data[0]
        this.event = events[0]
      })
    });
  }

}
