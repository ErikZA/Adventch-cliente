import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.scss']
})
export class SubscriptionListComponent implements OnInit {

  public association: string;
  public number = [1, 2, 3, 4, 5, 6];

  constructor(
    public router: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.router.params.subscribe((res: any) => this.association = res.id);

  }

}
