import { Component, OnInit, OnDestroy, Inject, ViewChild } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AppComponent } from './../../../app/app.component';
import { AuthService } from './../../../app/shared/auth.service';
import { SidenavService } from '../../core/services/sidenav.service';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  @ViewChild('drawerR') nav: MatDrawer;
  subscribe: Subscription;
  isMobile: boolean = false;
  isOpen: boolean = true;
  get year(): number { return new Date().getFullYear() };
  value = 95;

  constructor(
    private authService: AuthService,
    private media: ObservableMedia,
    private router: Router,
    public app: AppComponent,
    public navService: SidenavService
  ) { }

  ngOnInit() {
    this.subscribe = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias == 'xs');
      this.isOpen = !(this.isMobile || (change.mqAlias == 'sm') || (change.mqAlias == 'md'));
    });
    this.navService.toggle
      .asObservable()
      .subscribe(() => this.nav.toggle());
      console.log(this.nav);

  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  logoff() {
    this.authService.logoff();
  }

  updateCurrentNav(nav: string) {
    this.router.navigate([this.router.url.replace(/.*/, nav)]);
  }
}
