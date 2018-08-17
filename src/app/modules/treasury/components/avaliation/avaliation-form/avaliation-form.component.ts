import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-avaliation-form',
  templateUrl: './avaliation-form.component.html',
  styleUrls: ['./avaliation-form.component.scss']
})
export class AvaliationFormComponent implements OnInit, OnDestroy {
  subscribeUnit: Subscription;
  
  constructor() { }

  ngOnInit() {
  }
  
  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }


  saveAvaliation() {

  }

  closeSidenav() {
    //this.treasureService.setDistrict(new Districts());
    //this.sidenavService.close();
  }
}
