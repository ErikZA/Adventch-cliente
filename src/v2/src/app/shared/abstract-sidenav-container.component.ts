import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormSidenavRightComponent } from '../core/components/sidenav/form/form-sidenav-right/form-sidenav-right.component';

export abstract class AbstractSidenavContainer {
  @ViewChild('sidenavRight') sidenavRight: FormSidenavRightComponent;
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
