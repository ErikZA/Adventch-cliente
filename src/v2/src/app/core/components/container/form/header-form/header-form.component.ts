import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-form',
  templateUrl: './header-form.component.html',
  styleUrls: ['./header-form.component.scss']
})
export class HeaderFormComponent implements OnInit {

  @Input() title: string;

  constructor() { }

  ngOnInit() {
  }

}
