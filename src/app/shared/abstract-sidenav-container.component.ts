import { MatSidenav } from '@angular/material';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';

export abstract class AbstractSidenavContainer {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;
  protected abstract componentUrl: string;

  constructor(protected router: Router) {}

  openSidenav(delay = 70) {
    setTimeout(() => this.sidenavRight.open(), delay);
  }

  closeSidenav() {
    this.sidenavRight.close();
    this.router.navigate([this.componentUrl]);
  }
}
