import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-menu-expansion-item',
  templateUrl: './menu-expansion-item.component.html',
  styleUrls: ['./menu-expansion-item.component.scss']
})
export class MenuExpansionItemComponent implements OnInit {

  @Input()
  icon: string;
  @Input()
  title: string;
  @Input()
  actions = false;
  @Input()
  expanded = false;
  @Input()
  disabled = false;

  constructor() { }

  ngOnInit() {
  }

}
