import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { ProcessResponsibleInterface } from '../../../interfaces/process-responsible-interface';

@Component({
  selector: 'app-student-process-data-pendency',
  templateUrl: './student-process-data-pendency.component.html',
  styleUrls: ['./student-process-data-pendency.component.scss']
})
export class StudentProcessDataPendencyComponent implements OnInit {

  @Input()
  process: ProcessResponsibleInterface;

  constructor() { }

  ngOnInit() {
  }

}
