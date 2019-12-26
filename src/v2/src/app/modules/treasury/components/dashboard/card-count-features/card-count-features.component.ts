import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card-count-features',
  templateUrl: './card-count-features.component.html',
  styleUrls: ['./card-count-features.component.scss']
})
export class CardCountFeaturesComponent implements OnInit {

  @Input() title = '';
  @Input() count = 0;
  @Input() color = 'white';
  constructor() { }

  ngOnInit() {
  }

  public getColorText(): string {
    return this.color !== 'white' ? 'white' : 'black';
  }

}
