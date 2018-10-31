import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ObservableMedia, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
@AutoUnsubscribe()
export class ToolbarComponent implements OnInit, OnDestroy {

  @Input()
  color = 'primary';
  @Input()
  menu = true;
  @Input()
  responsible = false;
  private menuOpened = true;

  subscribe: Subscription;

  @Output()
  menuEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private media: ObservableMedia
  ) { }

  ngOnInit() {
    this.subscribe = this.media.subscribe((change: MediaChange) => {
      const isMobile = (change.mqAlias === 'xs');
      this.menuOpened = !(isMobile || (change.mqAlias === 'sm') || (change.mqAlias === 'md'));
    });
  }

  ngOnDestroy(): void {
  }

  public menuEventEmitter(): void {
    this.menuOpened = !this.menuOpened;
    this.menuEvent.emit(this.menuOpened);
  }
}
