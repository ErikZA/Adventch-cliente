import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-layout-container',
  templateUrl: './layout-container.component.html',
  styleUrls: ['./layout-container.component.scss']
})
export class LayoutContainerComponent implements OnInit {

  @Input() title: string;
  @Input() buttonLabel: string;
  @Output() buttonHeader = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  public buttonClick(): void {
    this.buttonHeader.emit(true);
  }
}
