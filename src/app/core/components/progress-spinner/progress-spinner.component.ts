import { Component, OnInit, Input } from '@angular/core';
import { State } from './models/state';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss']
})
export class ProgressSpinnerComponent implements OnInit {

  @Input() state: State;

  constructor() { }

  ngOnInit() {
  }

}
