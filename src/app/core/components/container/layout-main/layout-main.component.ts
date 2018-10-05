import { Component, OnInit } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-layout-main',
  templateUrl: './layout-main.component.html',
  styleUrls: ['./layout-main.component.scss']
})
export class LayoutMainComponent implements OnInit {

  isOpen = true;
  isMobile = false;
  subscribe: Subscription;

  constructor(
    private media: ObservableMedia
  ) { }

  ngOnInit() {
    this.subscribe = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias === 'xs');
      this.isOpen = !(this.isMobile || (change.mqAlias === 'sm') || (change.mqAlias === 'md'));
    });
  }

  public openMenu(menuToggle): void {
    this.isOpen = menuToggle;
  }
}
