import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AppComponent } from './../../../app/app.component';
import { AuthService } from './../../../app/shared/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  subscribe: Subscription;
  isMobile: boolean = false;
  isOpen: boolean = true;
  get year(): number { return new Date().getFullYear() };

  constructor(
    private authService: AuthService,
    private media: ObservableMedia,
    private router: Router,
    public app: AppComponent,
  ) { }

  ngOnInit() {
    this.subscribe = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias == 'xs');
      this.isOpen = !(this.isMobile || (change.mqAlias == 'sm') || (change.mqAlias == 'md'));
    });
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
