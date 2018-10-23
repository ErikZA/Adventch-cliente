import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Input()
  color = 'primary';
  @Input()
  menu = true;
  @Input()
  responsible = false;
  private menuOpened = true;

  @Output()
  menuEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  public menuEventEmitter(): void {
    this.menuOpened = !this.menuOpened;
    this.menuEvent.emit(this.menuOpened);
  }
}
