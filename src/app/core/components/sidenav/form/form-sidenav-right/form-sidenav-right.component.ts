import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-form-sidenav-right',
  templateUrl: './form-sidenav-right.component.html',
  styleUrls: ['./form-sidenav-right.component.scss']
})
export class FormSidenavRightComponent implements OnInit {

  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  @Output()
  private closeEmitted: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  public closeEmitter(): void {
    this.closeEmitted.emit(true);
  }

  public close(): void {
    this.sidenavRight.close();
  }

  public open(): void {
    this.sidenavRight.open();
  }

}
