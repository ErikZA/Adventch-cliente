import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public nameEvent: string;
  public products;

  constructor(
    public router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.params.subscribe((res: any) => this.nameEvent = res.id);
  }

}
