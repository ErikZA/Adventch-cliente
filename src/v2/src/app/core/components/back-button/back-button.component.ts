import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'back-button',
  templateUrl: './back-button.component.html'
})
export class BackButtonComponent implements OnInit {

  @Input() color: string;
  @Input() value = 'CANCELAR';

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}
