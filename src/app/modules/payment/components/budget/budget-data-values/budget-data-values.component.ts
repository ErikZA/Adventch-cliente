import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-budget-data-values',
  templateUrl: './budget-data-values.component.html',
  styleUrls: ['./budget-data-values.component.scss']
})
export class BudgetDataValuesComponent implements OnInit {
  @Input()
  label: string;

  @Input()
  value: string;

  constructor() { }

  ngOnInit() {
  }

}
