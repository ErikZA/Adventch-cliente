import { Component, OnInit, OnDestroy } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss']
})
@AutoUnsubscribe()
export class LayoutMainComponent implements OnInit, OnDestroy {

  isOpen = true;
  isMobile = false;
  subscribe: Subscription;

  constructor(
    private media: ObservableMedia
  ) { }

  ngOnInit() {
    this.subscribe = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias === 'xs');
      this.isOpen = !((this.isMobile && !this.isOpen)
      || ((change.mqAlias === 'sm') && !this.isOpen)
      || ((change.mqAlias === 'md') && !this.isOpen));
    });
  }

  ngOnDestroy(): void {
  }

  public openMenu(menuToggle): void {
    this.isOpen = menuToggle;
  }

  public setAsOff(): void {
    this.isOpen = false;
  }
}
