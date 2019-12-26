import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  // tslint:disable-next-line:no-input-rename
  @Input('color') public selectedColor = '#000';
  @Output() public change: EventEmitter<any> = new EventEmitter();

  colors: string[][] = [
    ['#eee', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#cfe2f3', '#d9d2e9', '#ead1dc'],
    ['#ccc', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
    ['#999', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6fa8dc', '#8e7cc3', '#c27ba0'],
    ['#666', '#c00', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3d85c6', '#674ea7', '#a64d79'],
    ['#333', '#900', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#0b5394', '#351c75', '#741b47']
  ];

  constructor() { }

  ngOnInit() {
    if (this.selectedColor !== '#000') {
      this.change.emit({ color: this.selectedColor });
    }
  }

  setColor(color: string) {
    const changed = this.selectedColor !== color;
    this.selectedColor = color;
    if (changed) {
      this.change.emit({ color: color });
    }
  }

}
